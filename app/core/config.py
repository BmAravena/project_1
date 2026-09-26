from typing import List, Union
from fastapi_cloud_cli.config import Settings
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict



class Settings(BaseSettings):
    # 1. Información General del Proyecto
    PROJECT_NAME: str = "Proyecto 1 API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    

# Setting instance
settings = Settings()