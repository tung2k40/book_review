from pydantic import BaseModel, ConfigDict
from typing import Optional

class ReviewBase(BaseModel):
    book_id: int
    content: str

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    book_title: Optional[str] = None
    author_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
