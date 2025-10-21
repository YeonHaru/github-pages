# app/__init__.py
from flask import Flask
from flask_cors import CORS
from .db import init_db
from .routes.auth_routes import auth_bp


def create_app(testing: bool = False):
    app = Flask(__name__)
    app.secret_key = "secret_key"

    # ==========================
    # DB 초기화
    # ==========================
    init_db(app)

    # ==========================
    # CORS 설정 (React 개발 서버 허용)
    # ==========================
    CORS(
        app,
        resources={
            r"/auth/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ],
                "supports_credentials": True,
                "allow_headers": ["Content-Type", "Authorization"],
                "methods": ["GET", "POST", "OPTIONS"],
            }
        },
    )

    # ==========================
    # 블루프린트 등록
    # ==========================
    app.register_blueprint(auth_bp, url_prefix="/auth")

    # ==========================
    # 기본 라우트 (테스트용)
    # ==========================
    @app.route("/")
    def home():
        return {"message": "Flask backend running!"}

    return app
