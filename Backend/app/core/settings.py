 # App settings
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Authentication API"
    
    # Security
    SECRET_KEY: str = "SECRET_KEY_HERE"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./auth_app.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()