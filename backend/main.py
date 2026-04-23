from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import các components từ package
import models.author
import models.book
import models.review
from routers.author_router import router as author_router
from routers.book_router import router as book_router
from routers.review_router import router as review_router

# Đảm bảo table được tạo dựa trên models đã import
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Book Review Backend API")

# Cấu hình CORS để cho phép Frontend React truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các domain (kể cả Vercel)
    allow_credentials=False, # Fix: Không thể dùng True khi để wildcard '*'
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối (Tích hợp) Router Author vào ứng dụng
app.include_router(author_router)
app.include_router(book_router)
app.include_router(review_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Backend", "status": "Connected to Database"}
