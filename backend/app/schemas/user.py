from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    address: Optional[str]


class UserInDB(UserBase):
    id: int

    class Config:
        orm_mode = True


class User(UserInDB):
    pass
