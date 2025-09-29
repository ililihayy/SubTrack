from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Company(Base):
    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, nullable=False)
    industry = Column(String)
    catch_phrase = Column(String)
    buzzword = Column(String)
    address = Column(String)

    subscriptions = relationship("Subscription", back_populates="company")
