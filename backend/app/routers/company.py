from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/", response_model=List[schemas.Company])
def list_companies(
    skip: int = 0, limit: int | None = 100, db: Session = Depends(get_db)
):
    return crud.get_companies(db, skip=skip, limit=limit)


@router.get("/{company_id}", response_model=schemas.Company)
def get_company(company_id: int, db: Session = Depends(get_db)):
    return crud.get_company(db, company_id)


@router.post("/", response_model=schemas.Company)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    return crud.create_company(db, company)


@router.patch("/{company_id}", response_model=schemas.Company)
def update_company(
    company_id: int,
    company_update: schemas.CompanyUpdate,
    db: Session = Depends(get_db),
):
    return crud.update_company(db, company_id, company_update)


@router.delete("/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    return crud.delete_company(db, company_id)
