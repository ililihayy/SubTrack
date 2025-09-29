from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Subscription(Base):
    id = Column(Integer, primary_key=True, index=True)
    plan = Column(String, nullable=False)
    status = Column(String)
    payment_method = Column(String)
    term = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"))
    company_id = Column(Integer, ForeignKey("companys.id"))

    user = relationship("User", back_populates="subscriptions")
    company = relationship("Company", back_populates="subscriptions")
