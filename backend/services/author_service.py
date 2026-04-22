from sqlalchemy.orm import Session
from models.author import Author
from validation.author_schema import AuthorCreate
import datetime

class AuthorService:
    @staticmethod
    def get_all_authors(db: Session):
        return db.query(Author).order_by(Author.id.asc()).all()

    @staticmethod
    def create_author(db: Session, author: AuthorCreate):
        # Default 'joined' to today's date if not provided
        joined_date = author.joined if author.joined else datetime.date.today().strftime("%Y-%m-%d")
        
        db_author = Author(
            name=author.name,
            books=author.books,
            joined=joined_date
        )
        db.add(db_author)
        db.commit()
        db.refresh(db_author)
        return db_author

    @staticmethod
    def update_author(db: Session, author_id: int, author: AuthorCreate):
        db_author = db.query(Author).filter(Author.id == author_id).first()
        if not db_author:
            return None
        
        # Cập nhật các trường
        db_author.name = author.name
        if author.books is not None:
            db_author.books = author.books
        if author.joined is not None:
            db_author.joined = author.joined
            
        db.commit()
        db.refresh(db_author)
        return db_author

    @staticmethod
    def delete_author(db: Session, author_id: int):
        db_author = db.query(Author).filter(Author.id == author_id).first()
        if db_author:
            db.delete(db_author)
            db.commit()
            return True
        return False
