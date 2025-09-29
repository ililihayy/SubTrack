from pydantic import BaseModel
from typing import Optional

class CompanyBase(BaseModel):
    business_name: str
    industry: Optional[str] = None
    catch_phrase: Optional[str] = None
    buzzword: Optional[str] = None
    address: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    business_name: Optional[str]
    industry: Optional[str]
    catch_phrase: Optional[str]
    buzzword: Optional[str]
    address: Optional[str]


class CompanyInDB(CompanyBase):
    id: int

    class Config:
        orm_mode = True


class Company(CompanyInDB):
    pass
