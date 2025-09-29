from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/", response_model=List[schemas.Subscription])
def list_subscriptions(skip: int = 0, limit: int | None = 100, db: Session = Depends(get_db)):
    return crud.get_subscriptions(db, skip=skip, limit=limit)


@router.get("/{subscription_id}", response_model=schemas.Subscription)
def get_subscription(subscription_id: int, db: Session = Depends(get_db)):
    return crud.get_subscription(db, subscription_id)


@router.post("/", response_model=schemas.Subscription)
def create_subscription(subscription: schemas.SubscriptionUpdate, db: Session = Depends(get_db)):
    return crud.create_subscription(db, subscription)


@router.patch("/{subscription_id}", response_model=schemas.Subscription)
def update_subscription(subscription_id: int, subscription_update: schemas.SubscriptionUpdate, db: Session = Depends(get_db)):
    return crud.update_subscription(db, subscription_id, subscription_update)


@router.delete("/{subscription_id}")
def delete_subscription(subscription_id: int, db: Session = Depends(get_db)):
    return crud.delete_subscription(db, subscription_id)
