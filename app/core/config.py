from typing import List, Union
from fastapi_cloud_cli.config import Settings
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


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
    

# Setting instance
settings = Settings()