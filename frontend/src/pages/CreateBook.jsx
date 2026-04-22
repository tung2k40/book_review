import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getAuthors } from "../../api/authorApi";
import { createBook } from "../../api/bookApi";

export default function CreateBook() {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Authors for the select dropdown
    getAuthors()
      .then((data) => setAuthors(data))
      .catch((err) =>
        console.error("Error fetching authors for Create Book", err),
      );
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Vui lòng nhập tên sách!");
      return;
    }
    if (!authorId) {
      setError("Vui lòng chọn tác giả!");
      return;
    }

    try {
      await createBook({ title: title.trim(), author_id: parseInt(authorId) });
      alert(`Đã tạo sách "${title.trim()}" thành công!`);
      navigate("/books");
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tạo sách. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/books")}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Thêm Sách
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Điền thông tin sách mới để thêm vào hệ thống.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 sm:p-8">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="book-title"
              className="block text-sm font-medium text-slate-700"
            >
              Tựa sách/Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="book-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Nhập tựa sách..."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="book-author"
              className="block text-sm font-medium text-slate-700"
            >
              Tác giả/Author <span className="text-rose-500">*</span>
            </label>
            <select
              id="book-author"
              value={authorId}
              onChange={(e) => {
                setAuthorId(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">-- Chọn tác giả --</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-rose-500 mt-1 font-medium">{error}</p>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              <Save size={18} />
              Tạo Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
