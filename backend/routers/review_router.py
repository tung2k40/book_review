from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db

from models.review import Review
from validation.review_schema import ReviewResponse, ReviewCreate
from services.review_service import ReviewService

router = APIRouter(
    prefix="/api/reviews",
    tags=["Reviews"]
)

@router.get("/", response_model=List[ReviewResponse])
def get_reviews(db: Session = Depends(get_db)):
    """Lấy danh sách đánh giá."""
    return ReviewService.get_all_reviews(db)

@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """Thêm tài liệu đánh giá mới vào database."""
    return ReviewService.create_review(db, review)

@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(review_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    """Cập nhật nội dung đánh giá."""
    updated = ReviewService.update_review(db, review_id, review)
    if not updated:
        raise HTTPException(status_code=404, detail="Review không tồn tại")
    return updated

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """Xóa một đánh giá khỏi database."""
    success = ReviewService.delete_review(db, review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review không tồn tại")
    return {"message": "Đã xóa đánh giá thành công"}
