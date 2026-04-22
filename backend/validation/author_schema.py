from pydantic import BaseModel, ConfigDict
from typing import Optional

class AuthorBase(BaseModel):
    name: str
    books: Optional[int] = 0
    joined: Optional[str] = None

class AuthorCreate(AuthorBase):
    pass

class AuthorResponse(AuthorBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
