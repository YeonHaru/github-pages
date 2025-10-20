import pyodbc

def get_db_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=MINI_DIARY;"
        "UID=sa;"
        "PWD=1234567890;"
    )
    return conn

def init_db(app):
    @app.teardown_appcontext
    def close_connection(exception):
        pass