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