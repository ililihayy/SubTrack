from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate, UserUpdate


def get_users(db: Session, skip: int = 0, limit: int | None = None):
    query = db.query(User).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def get_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


def create_user(db: Session, user: UserCreate):
    if user.email and "@" not in user.email:
        raise HTTPException(status_code=400, detail="Invalid email format.")

    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: UserUpdate):
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid user ID.")

    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")

    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")

    db.delete(db_user)
    db.commit()
    return {"detail": f"User with id {user_id} deleted successfully."}
