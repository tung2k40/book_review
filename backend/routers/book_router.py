from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db

from models.book import Book
from validation.book_schema import BookResponse, BookCreate
from services.book_service import BookService

router = APIRouter(
    prefix="/api/books",
    tags=["Books"]
)

@router.get("/", response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả các cuốn sách."""
    return BookService.get_all_books(db)

@router.post("/", response_model=BookResponse)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    """Thêm một sách mới vào database."""
    return BookService.create_book(db, book)

@router.put("/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book: BookCreate, db: Session = Depends(get_db)):
    """Cập nhật thông tin sách."""
    updated = BookService.update_book(db, book_id, book)
    if not updated:
        raise HTTPException(status_code=404, detail="Sách không tồn tại")
    return updated

@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Xóa sách khỏi database."""
    success = BookService.delete_book(db, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sách không tồn tại")
    return {"message": "Đã xóa sách thành công"}
