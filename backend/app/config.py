import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:////data/app.db")

API_PORT: int = 8000
API_HOST: str = "0.0.0.0"

RANDOM_DATA_API_BASE = os.getenv(
    "RANDOM_DATA_API_BASE", "https://random-data-api.com/api/v2"
)
