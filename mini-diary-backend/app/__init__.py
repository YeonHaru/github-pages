from flask import Flask
from .db import init_db
from .routes.auth_routes import auth_bp

def create_app(testing=False):
    app = Flask(__name__)
    app.secret_key = "secret_key"

    # db 초기화
    init_db(app)

    # 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app