from pydantic import BaseModel, ConfigDict
from typing import Optional

class BookBase(BaseModel):
    title: str
    author_id: int

class BookCreate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    author_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
