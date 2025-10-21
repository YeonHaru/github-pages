# auth_routes.py
import os
from flask import Blueprint, request, jsonify, current_app, g
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import find_user_by_user_id, insert_user
from app.db import get_db_connection

import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
import re

auth_bp = Blueprint("auth", __name__)

# JWT 설정
JWT_ALG = "HS256"
ACCESS_EXPIRES_MIN = 15      # 액세스 토큰 만료(분)
REFRESH_EXPIRES_DAYS = 7     # 리프레시 토큰 만료(일)
BEARER_RE = re.compile(r"^Bearer\s+(.+)$", re.IGNORECASE)

# 인메모리 토큰 블랙리스트 (로그아웃 처리용)
REVOKED_TOKEN: dict[str, int] = {}

def _cleanup_revoked():
    """만료된 항목 주기적으로 정리"""
    if not REVOKED_TOKEN:
        return
    now = int(datetime.now(timezone.utc).timestamp())
    expired_keys = [k for k, exp in REVOKED_TOKEN.items() if exp <= now]
    for k in expired_keys:
        REVOKED_TOKEN.pop(k, None)

def _is_revoked(token: str) -> bool:
    """블랙리스트 여부 확인"""
    _cleanup_revoked()
    exp = REVOKED_TOKEN.get(token)
    if exp is None:
        return False
    # 만료전일경우 사용 금지
    return int(datetime.now(timezone.utc).timestamp()) < exp


# 앱 설정의 SECRET_KEY 사용
def _get_secret() -> str:
    # 1) app.config 에서 우선 시도
    secret = current_app.config.get("SECRET_KEY")

    # 2) 없으면 환경변수에서 시도
    if not secret:
        secret = os.getenv("SECRET_KEY")
        if secret:
            current_app.config["SECRET_KEY"] = secret
    if not secret:
        # 개발 편의용 디폴트. 운영에서는 반드시 안전한 값으로 설정하세요.
        secret = "CHANGE_ME_IN_PRODUCTION"
        current_app.config["SECRET_KEY"] = secret
    return secret


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(user_id: str, username: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "username": username,
        "email": email,
        "type": "access",
        "iat": int(_now_utc().timestamp()),
        "exp": int((_now_utc() + timedelta(minutes=ACCESS_EXPIRES_MIN)).timestamp()),
    }
    return jwt.encode(payload, _get_secret(), algorithm=JWT_ALG)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "iat": int(_now_utc().timestamp()),
        "exp": int((_now_utc() + timedelta(days=REFRESH_EXPIRES_DAYS)).timestamp()),
    }
    return jwt.encode(payload, _get_secret(), algorithm=JWT_ALG)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, _get_secret(), algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def _get_bearer_token_from_header() -> str | None:
    """
    Authorization: Bearer <token> 에서 <token>만 추출
    """
    auth_header = request.headers.get("Authorization", "")
    m = BEARER_RE.match(auth_header)
    return m.group(1) if m else None


# 보호 라우트 데코레이터
def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = _get_bearer_token_from_header()
        if not token:
            return jsonify({"error": "Authorization 헤더가 없거나 Bearer 토큰이 없습니다."}), 401

        payload = decode_token(token)
        if not payload or payload.get("type") != "access":
            return jsonify({"error": "유효하지 않은 액세스 토큰입니다."}), 401

        user_id = payload.get("sub")
        user = find_user_by_user_id(user_id)
        if not user:
            return jsonify({"error": "토큰의 사용자를 찾을 수 없습니다."}), 401

        # user row: (user_id, username, password_hash, email, created_at, updated_at)
        g.current_user = {
            "user_id": user[0],
            "username": user[1],
            "email": user[3],
        }
        return fn(*args, **kwargs)
    return wrapper


# 회원가입
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    user_id = (data.get("user_id") or "").strip()
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "")

    if not user_id or not username or not email or not password:
        return jsonify({"error": "모든 필드를 입력하세요."}), 400

    if find_user_by_user_id(user_id):
        return jsonify({"error": "이미 존재하는 user_id입니다."}), 409

    # 이미 존재하는 email?
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM USERS WHERE EMAIL = ?", (email,))
    if cur.fetchone():
        conn.close()
        return jsonify({"error": "이미 사용중인 email입니다."}), 409
    conn.close()

    # 비밀번호 해싱 후 저장
    hashed_pw = generate_password_hash(password)
    insert_user(user_id, username, hashed_pw, email)

    # 가입 직후 토큰 발급(선택)
    access = create_access_token(user_id, username, email)
    refresh = create_refresh_token(user_id)

    return jsonify({
        "message": "회원가입 성공",
        "user": {"user_id": user_id, "username": username, "email": email},
        "tokens": {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "Bearer",
            "expires_in": ACCESS_EXPIRES_MIN * 60,
        },
    }), 201


# 로그인
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    user_id = (data.get("user_id") or "").strip()
    password = (data.get("password") or "")

    if not user_id or not password:
        return jsonify({"error": "user_id와 password를 입력하세요."}), 400

    user = find_user_by_user_id(user_id)
    if not user:
        return jsonify({"error": "존재하지 않는 사용자입니다."}), 401

    stored_hash = user[2]
    if not check_password_hash(stored_hash, password):
        return jsonify({"error": "비밀번호가 일치하지 않습니다."}), 401

    access = create_access_token(user[0], user[1], user[3])
    refresh = create_refresh_token(user[0])

    return jsonify({
        "message": "로그인 성공",
        "user": {"user_id": user[0], "username": user[1], "email": user[3]},
        "tokens": {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "Bearer",
            "expires_in": ACCESS_EXPIRES_MIN * 60,
        },
    }), 200


# 액세스 토큰 리프레시
@auth_bp.route("/refresh", methods=["POST"])
def refresh():

    token = _get_bearer_token_from_header()
    if not token:
        body = request.get_json(silent=True) or {}
        token = body.get("refresh_token")

    if not token:
        return jsonify({"error": "리프레시 토큰이 필요합니다."}), 400

    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        return jsonify({"error": "유효하지 않은 리프레시 토큰입니다."}), 401

    user_id = payload.get("sub")
    user = find_user_by_user_id(user_id)
    if not user:
        return jsonify({"error": "토큰의 사용자를 찾을 수 없습니다."}), 401

    new_access = create_access_token(user[0], user[1], user[3])

    return jsonify({
        "access_token": new_access,
        "token_type": "Bearer",
        "expires_in": ACCESS_EXPIRES_MIN * 60,
    }), 200


# 보호된 예시 엔드포인트
@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me():
    return jsonify({"user": g.current_user}), 200
