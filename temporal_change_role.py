"""
import sqlite3

# Conect to the SQLite database (make sure the path is correct)
conn = sqlite3.connect("sql_app.db")
cursor = conn.cursor()

# Update the role of the user you want (change the email for yours)
cursor.execute(
    "UPDATE users SET role = 'admin' WHERE email = ?", 
    ("benjamin@gmail.com",)
)

conn.commit()
conn.close()
print("¡Role updated to admin successfully!")
"""



import psycopg2
from app.core.config import settings

# Limpiamos el "+asyncpg" para que psycopg2 pueda interpretar la URL correctamente
db_url = settings.DATABASE_URL_POSTGRES.replace("+asyncpg", "")

conn = psycopg2.connect(db_url)
cursor = conn.cursor()

# Actualiza el rol del usuario
cursor.execute(
    "UPDATE users SET role = %s WHERE email = %s", 
    ("admin", "benjamin@gmail.com")
)

conn.commit()
cursor.close()
conn.close()
print("¡Role updated to admin successfully in PostgreSQL!")