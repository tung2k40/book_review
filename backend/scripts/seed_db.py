import sys
import os

# Thêm đường dẫn thư mục backend vào hệ thống để có thể import từ database.py và models.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine, Base
from models.author import Author

# Tạo các bảng trong DB nếu chưa có
Base.metadata.create_all(bind=engine)

mockAuthors = [
  { "id": 1, "name": "Haruki Murakami", "books": 14, "joined": "2023-01-15" },
  { "id": 2, "name": "J.K. Rowling", "books": 7, "joined": "2023-02-22" },
  { "id": 3, "name": "George R.R. Martin", "books": 5, "joined": "2023-03-10" },
  { "id": 4, "name": "Agatha Christie", "books": 66, "joined": "2023-04-05" },
  { "id": 5, "name": "Stephen King", "books": 61, "joined": "2023-05-20" },
]

def seed_db():
    db = SessionLocal()
    try:
        # Xóa BẢNG cũ hoàn toàn và tạo lại BẢNG mới (để ép cập nhật cấu trúc schema PostgreSQL)
        print("Dropping old schema and recreating...")
        Author.__table__.drop(engine, checkfirst=True)
        Base.metadata.create_all(bind=engine)
            
        for author_data in mockAuthors:
            db_author = Author(**author_data)
            db.add(db_author)
            
        db.commit()
        print(f"Successfully seeded Database with {len(mockAuthors)} mock authors.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
