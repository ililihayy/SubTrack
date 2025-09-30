from fastapi import APIRouter
from app.routers import user, subscription, company, random

api_router = APIRouter()

api_router.include_router(user.router)
api_router.include_router(company.router)
api_router.include_router(subscription.router)
api_router.include_router(random.router)
