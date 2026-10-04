import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # general information
    PROJECT_NAME: str = "Users Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # async URL SQLite (create a local SQLite database file named 'sql_app.db' in the current directory)
    ASYNC_DATABASE_URL: str = "sqlite+aiosqlite:///./sql_app.db"

    # security settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",  # Usa el operador / para unir rutas limpiamente
        extra="ignore"
    )

# Setting instance
settings = Settings()