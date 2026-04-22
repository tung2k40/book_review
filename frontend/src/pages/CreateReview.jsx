import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getBooks } from "../../api/bookApi";
import { createReview } from "../../api/reviewApi";

export default function CreateReview() {
  const [bookId, setBookId] = useState("");
  const [content, setContent] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const MAX_WORDS = 500;

  // Calculate current words
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    // Fetch books to populate the dropdown
    getBooks()
      .then((data) => setBooks(data))
      .catch((err) =>
        console.error("Error fetching books for Create Review", err),
      );
  }, []);

  const handleContentChange = (e) => {
    const text = e.target.value;
    const currentWords = text.trim() ? text.trim().split(/\s+/).length : 0;

    // Allow typing if within limit, or allow backspacing
    if (currentWords <= MAX_WORDS || text.length < content.length) {
      setContent(text);
      if (error) setError("");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!bookId) {
      setError("Vui lòng chọn sách!");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung đánh giá!");
      return;
    }
    if (wordCount > MAX_WORDS) {
      setError(`Nội dung đánh giá không được vượt quá ${MAX_WORDS} từ!`);
      return;
    }

    try {
      await createReview({
        book_id: parseInt(bookId),
        content: content.trim(),
      });
      alert(`Đã tạo đánh giá thành công!`);
      navigate("/reviews");
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tạo đánh giá API. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/reviews")}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Thêm Đánh Giá
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Viết đánh giá cho sách trong hệ thống.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 sm:p-8">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="review-book"
              className="block text-sm font-medium text-slate-700"
            >
              Chọn Sách/Book <span className="text-rose-500">*</span>
            </label>
            <select
              id="review-book"
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">-- Chọn Sách cần đánh giá --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} (bởi {book.author_name})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="review-content"
                className="block text-sm font-medium text-slate-700"
              >
                Nội dung đánh giá <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-xs font-medium ${wordCount > MAX_WORDS ? "text-rose-500" : "text-slate-500"}`}
              >
                {wordCount}/{MAX_WORDS} từ
              </span>
            </div>
            <textarea
              id="review-content"
              rows={6}
              value={content}
              onChange={handleContentChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
              placeholder="Nhập nội dung đánh giá của bạn (tối đa 500 từ)..."
            />
          </div>

          {error && (
            <p className="text-sm text-rose-500 mt-1 font-medium">{error}</p>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/reviews")}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              <Save size={18} />
              Đăng Đánh Giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
