from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "API"
    debug: bool = False
    translation_model_cache_dir: Optional[str] = None
    latin_to_english_model: str = "Helsinki-NLP/opus-mt-ROMANCE-en"
    english_to_latin_model: str = "Helsinki-NLP/opus-mt-en-ROMANCE"
    english_to_latin_prefix: str = ">>la<< "

    class Config:
        env_file = ".env"


settings = Settings()
