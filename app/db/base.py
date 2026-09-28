# app/db/base.py

# 1. Importamos la Base común
from db.session import Base

# 2. Importamos todos los modelos para que se registren en Base.metadata
from db.models.user import User
# Si mañana agregas más modelos, los importas aquí:
# from app.db.models.product import Product
# from app.db.models.order import Order