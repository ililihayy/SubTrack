from pydantic import BaseModel
from typing import Optional


class SubscriptionBase(BaseModel):
    plan: str
    status: Optional[str] = None
    payment_method: Optional[str] = None
    term: Optional[str] = None
    user_id: Optional[int] = None
    company_id: Optional[int] = None


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    plan: Optional[str]
    status: Optional[str]
    payment_method: Optional[str]
    term: Optional[str] = None
    user_id: Optional[int] = None
    company_id: Optional[int] = None


class SubscriptionInDB(SubscriptionBase):
    id: int

    class Config:
        orm_mode = True


class Subscription(SubscriptionInDB):
    pass
