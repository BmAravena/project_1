from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import settings

# Create an asynchronous SQLAlchemy engine for the database connection
engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    connect_args={"check_same_thread": False},  # Necessary for SQLite to allow multiple threads to access the database
    echo=True  # Shows SQL queries in the console (ideal for learning)
)

# Generator for creating async sessions
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Declarative base class for SQLAlchemy models
Base = declarative_base()

# 4. Dependency Injection for using in the endpoints (e.g., health check)
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()