from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Subscription
from app.schemas import SubscriptionCreate, SubscriptionUpdate


def get_subscriptions(db: Session, skip: int = 0, limit: int | None = None):
    query = db.query(Subscription).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def get_subscription(db: Session, subscription_id: int):
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found.")
    return subscription


def create_subscription(db: Session, subscription: SubscriptionCreate):
    if subscription.plan == "":
        raise HTTPException(status_code=400, detail="Plan cannot be empty.")

    db_subscription = Subscription(**subscription.model_dump())
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def update_subscription(db: Session, subscription_id: int, subscription_update: SubscriptionUpdate):
    if subscription_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid subscription ID.")

    db_subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id).first()
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found.")

    update_data = subscription_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_subscription, key, value)

    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def delete_subscription(db: Session, subscription_id: int):
    db_subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id).first()
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found.")

    db.delete(db_subscription)
    db.commit()
    return {"detail": f"Subscription with id {subscription_id} deleted successfully."}
