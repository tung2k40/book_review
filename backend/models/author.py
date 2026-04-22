from sqlalchemy import Column, Integer, String
from database import Base

class Author(Base):
    __tablename__ = "authors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    books = Column(Integer, default=0)
    joined = Column(String)
