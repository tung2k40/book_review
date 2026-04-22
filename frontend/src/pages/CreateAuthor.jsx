import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createAuthor } from "../../api/authorApi";

export default function CreateAuthor() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validate: if empty, show error
    if (!name.trim()) {
      setError("Vui lòng nhập tên tác giả!");
      return;
    }

    try {
      await createAuthor({ name: name.trim() });
      alert(`Đã tạo tác giả "${name}" thành công!`);
      navigate("/authors");
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi gọi API. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/authors")}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Thêm Tác Giả
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Điền thông tin tác giả mới để thêm vào hệ thống.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 sm:p-8">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="author-name"
              className="block text-sm font-medium text-slate-700"
            >
              Tên tác giả <span className="text-rose-500">*</span>
            </label>
            <input
              id="author-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className={`w-full px-4 py-2.5 bg-slate-50 border ${
                error
                  ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              } text-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all`}
              placeholder="Nhập tên tác giả..."
            />
            {error && (
              <p className="text-sm text-rose-500 mt-1.5 font-medium animate-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/authors")}
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
