"""Configuration module for CareerGap AI Backend Service."""

import os
from pydantic import BaseModel


class Settings(BaseModel):
    PROJECT_NAME: str = "CareerGap AI Backend"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Upload constraints
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: set[str] = {".pdf"}
    
    # Scoring weights
    REQUIRED_WEIGHT_RATIO: float = 0.80
    PREFERRED_WEIGHT_RATIO: float = 0.20
    
    # AI provider configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "deterministic_fallback")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-1.5-flash")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]


settings = Settings()
