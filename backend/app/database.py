from sqlalchemy import create_engine, Column, Integer, DateTime, func
from sqlalchemy.orm import sessionmaker, declared_attr, Session, DeclarativeBase
from app.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL, echo=True, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr
    def __tablename__(cls) -> str:
        return f"{cls.__name__.lower()}s"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
