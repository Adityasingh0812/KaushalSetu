from pydantic import Field
from pydantic_settings import BaseSettings
from typing import List, Union
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "KaushalSetu"
    API_V1_STR: str = "/api/v1"
    # Security
    SECRET_KEY: str = Field(default="CHANGE_ME_IN_PRODUCTION", env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    # Database
    POSTGRES_SERVER: str = Field(default="localhost", env="POSTGRES_SERVER")
    POSTGRES_USER: str = Field(default="postgres", env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(default="postgres", env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field(default="kaushalsetu", env="POSTGRES_DB")
    POSTGRES_PORT: str = Field(default="5432", env="POSTGRES_PORT")
    DATABASE_URL: Union[str, None] = None
    AUTO_CREATE_TABLES: bool = Field(default=False, env="AUTO_CREATE_TABLES")

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Demo accounts (for seeding)
    DEMO_ACCOUNTS: List[dict] = [
        {
            "email": "govadmin@example.com",
            "password": "GovAdmin123!",
            "full_name": "Government Administrator",
            "role": "gov_admin",
        },
        {
            "email": "institute@example.com",
            "password": "Institute123!",
            "full_name": "Institute Officer",
            "role": "institute_officer",
        },
        {
            "email": "trainee@example.com",
            "password": "Trainee123!",
            "full_name": "Demo Trainee",
            "role": "trainee",
        },
        {
            "email": "employer@example.com",
            "password": "Employer123!",
            "full_name": "Demo Employer",
            "role": "employer",
        },
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()