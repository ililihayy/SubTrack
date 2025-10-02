from fastapi import FastAPI
from app.routers.api import api_router
from app.database import Base, engine
from app.models import *
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sub Track API")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
