from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, Dict, List

from app.database import get_db
from app import schemas
from app.services import random_service


router = APIRouter(prefix="/random", tags=["random-data"])


@router.get("/users")
def get_random_users(size: int = 10):
    try:
        return random_service.fetch_with_fallback("users", size)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"RandomDataAPI error: {exc}")


@router.get("/companies")
def get_random_companies(size: int = 10):
    try:
        return random_service.fetch_with_fallback("companies", size)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"RandomDataAPI error: {exc}")


@router.get("/subscriptions")
def get_random_subscriptions(size: int = 10):
    return [random_service.mock_random_subscription() for _ in range(max(1, size))]


@router.post("/subscriptions/save", response_model=schemas.Subscription)
def save_random_subscription(
    random_subscription: Dict[str, Any], db: Session = Depends(get_db)
):
    try:
        return random_service.save_random_subscription(random_subscription, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/users/save", response_model=schemas.User)
def save_random_user(random_user: Dict[str, Any], db: Session = Depends(get_db)):
    return random_service.save_random_user(random_user, db)


@router.post("/companies/save", response_model=schemas.Company)
def save_random_company(random_company: Dict[str, Any], db: Session = Depends(get_db)):
    return random_service.save_random_company(random_company, db)
