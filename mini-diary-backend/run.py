# Flask 실행 진입점


from app import create_app      # app 폴더 안 __init__.py 파일에서 create_app 함수를 가져옴

app = create_app()

# 파이썬의 실행 조건문
if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)