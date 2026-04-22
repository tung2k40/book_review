from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db

from models.author import Author
from validation.author_schema import AuthorResponse, AuthorCreate
from services.author_service import AuthorService

router = APIRouter(
    prefix="/api/authors",
    tags=["Authors"]
)

@router.post("/", response_model=AuthorResponse)
def create_author(author: AuthorCreate, db: Session = Depends(get_db)):
    """Thêm một tác giả mới vào database."""
    return AuthorService.create_author(db, author)

@router.get("/", response_model=List[AuthorResponse])
def get_authors(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả các tác giả từ database."""
    return AuthorService.get_all_authors(db)

from fastapi import HTTPException

@router.put("/{author_id}", response_model=AuthorResponse)
def update_author(author_id: int, author: AuthorCreate, db: Session = Depends(get_db)):
    """Cập nhật thông tin tác giả."""
    updated = AuthorService.update_author(db, author_id, author)
    if not updated:
        raise HTTPException(status_code=404, detail="Tác giả không tồn tại")
    return updated

@router.delete("/{author_id}")
def delete_author(author_id: int, db: Session = Depends(get_db)):
    """Xóa một tác giả khỏi database."""
    success = AuthorService.delete_author(db, author_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tác giả không tồn tại")
    return {"message": "Đã xóa tác giả thành công"}
