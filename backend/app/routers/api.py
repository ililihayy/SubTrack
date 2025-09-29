from fastapi import APIRouter
from app.routers import user, subscription, company

api_router = APIRouter()

api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(
    company.router, prefix="/companies", tags=["companies"])
api_router.include_router(
    subscription.router, prefix="/subscriptions", tags=["subscriptions"])
