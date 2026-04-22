from sqlalchemy.orm import Session
from models.review import Review
from validation.review_schema import ReviewCreate, ReviewResponse

class ReviewService:
    @staticmethod
    def get_all_reviews(db: Session):
        db_reviews = db.query(Review).order_by(Review.id.asc()).all()
        result = []
        for r in db_reviews:
            book_title = r.book.title if r.book else "Không rõ"
            author_name = r.book.author.name if r.book and r.book.author else "Khuyết danh"
            
            result.append(ReviewResponse(
                id=r.id,
                book_id=r.book_id,
                content=r.content,
                book_title=book_title,
                author_name=author_name
            ))
        return result

    @staticmethod
    def create_review(db: Session, review: ReviewCreate):
        db_review = Review(
            book_id=review.book_id,
            content=review.content
        )
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        
        book_title = db_review.book.title if db_review.book else "Không rõ"
        author_name = db_review.book.author.name if db_review.book and db_review.book.author else "Khuyết danh"
        
        return ReviewResponse(
            id=db_review.id,
            book_id=db_review.book_id,
            content=db_review.content,
            book_title=book_title,
            author_name=author_name
        )

    @staticmethod
    def update_review(db: Session, review_id: int, review: ReviewCreate):
        db_review = db.query(Review).filter(Review.id == review_id).first()
        if not db_review:
            return None
        
        db_review.book_id = review.book_id
        db_review.content = review.content
        db.commit()
        db.refresh(db_review)
        
        book_title = db_review.book.title if db_review.book else "Không rõ"
        author_name = db_review.book.author.name if db_review.book and db_review.book.author else "Khuyết danh"
        
        return ReviewResponse(
            id=db_review.id,
            book_id=db_review.book_id,
            content=db_review.content,
            book_title=book_title,
            author_name=author_name
        )

    @staticmethod
    def delete_review(db: Session, review_id: int):
        db_review = db.query(Review).filter(Review.id == review_id).first()
        if db_review:
            db.delete(db_review)
            db.commit()
            return True
        return False
