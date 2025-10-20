from .db import get_db_connection

def find_user_by_user_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("select * from users where user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return row

def insert_user(user_id, username, password, email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        insert into users (user_id, username, password, email)
        values (?, ?, ?, ?)
    """, (user_id, username, password, email))
    conn.commit()
    conn.close()