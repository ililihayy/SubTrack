from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Company
from app.schemas import CompanyCreate, CompanyUpdate


def get_companies(db: Session, skip: int = 0, limit: int | None = None):
    query = db.query(Company).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def get_company(db: Session, company_id: int):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")
    return company


def create_company(db: Session, company: CompanyCreate):
    db_company = Company(**company.model_dump())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


def update_company(db: Session, company_id: int, company_update: CompanyUpdate):
    if company_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid company ID.")

    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found.")

    update_data = company_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)

    db.commit()
    db.refresh(db_company)
    return db_company


def delete_company(db: Session, company_id: int):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found.")

    db.delete(db_company)
    db.commit()
    return {"detail": f"Company with id {company_id} deleted successfully."}
