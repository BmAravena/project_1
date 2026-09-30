import sys
import os

# Agrega la raíz al path de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

# IMPORTANTE: Esta debe ser la única forma en que traigas 'app'
from app.main import app as fastapi_app
from app.db.session import get_db, Base
import app.db.base

# ... el resto de tu código de conftest.py (TEST_DATABASE_URL, fixtures, etc.)
# 1. Base de datos SQLite exclusiva para tests (en memoria, se borra al terminar)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 2. Reemplazamos la base de datos real por la de pruebas en los endpoints
async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

fastapi_app.dependency_overrides[get_db] = override_get_db


# 3. Crea las tablas antes de cada test y las borra al finalizar
@pytest.fixture(autouse=True)
async def setup_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# 4. Proveedor del cliente HTTP simulado para los tests de integración
@pytest.fixture
def client():
    with TestClient(fastapi_app) as c:
        yield c