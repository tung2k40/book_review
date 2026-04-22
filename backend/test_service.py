from sqlalchemy.orm import Session
from database import SessionLocal
from validation.author_schema import AuthorCreate
from services.author_service import AuthorService

db = SessionLocal()
try:
    author_data = AuthorCreate(name="Test Author Python")
    result = AuthorService.create_author(db, author_data)
    print("Success:", result.name)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
