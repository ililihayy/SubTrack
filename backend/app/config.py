import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///app.db")

RANDOM_DATA_API_BASE = os.getenv(
    "RANDOM_DATA_API_BASE", "https://random-data-api.com/api/v2"
)
