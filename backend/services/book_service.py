from sqlalchemy.orm import Session
from models.book import Book
from models.author import Author
from validation.book_schema import BookCreate, BookResponse

class BookService:
    @staticmethod
    def get_all_books(db: Session):
        db_books = db.query(Book).order_by(Book.id.asc()).all()
        result = []
        for b in db_books:
            # Map author name correctly
            author_name = b.author.name if b.author else "Khuyết danh"
            result.append(BookResponse(
                id=b.id,
                title=b.title,
                author_id=b.author_id,
                author_name=author_name
            ))
        return result

    @staticmethod
    def create_book(db: Session, book: BookCreate):
        db_book = Book(
            title=book.title,
            author_id=book.author_id
        )
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        
        # also update author's book count as basic increment
        author = db.query(Author).filter(Author.id == book.author_id).first()
        if author:
            if not author.books: author.books = 0
            author.books += 1
            db.commit()
            
        author_name = author.name if author else "Khuyết danh"
        return BookResponse(
            id=db_book.id,
            title=db_book.title,
            author_id=db_book.author_id,
            author_name=author_name
        )

    @staticmethod
    def update_book(db: Session, book_id: int, book: BookCreate):
        db_book = db.query(Book).filter(Book.id == book_id).first()
        if not db_book:
            return None
        
        db_book.title = book.title
        db_book.author_id = book.author_id
        db.commit()
        db.refresh(db_book)
        
        author_name = db_book.author.name if db_book.author else "Khuyết danh"
        return BookResponse(
            id=db_book.id,
            title=db_book.title,
            author_id=db_book.author_id,
            author_name=author_name
        )

    @staticmethod
    def delete_book(db: Session, book_id: int):
        db_book = db.query(Book).filter(Book.id == book_id).first()
        if db_book:
            db.delete(db_book)
            db.commit()
            return True
        return False
