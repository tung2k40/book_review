import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Modal from "../components/Modal";
import { getBooks, updateBook, deleteBook } from "../../api/bookApi";

export default function Book() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / ITEMS_PER_PAGE),
  );
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    getBooks()
      .then((data) => {
        setBooks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setIsLoading(false);
      });
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    isDanger: false,
    confirmText: "",
  });

  const handleUpdate = (book) => {
    const newTitle = window.prompt(
      `Nhập tựa sách mới cho "${book.title}":`,
      book.title,
    );
    if (!newTitle || newTitle.trim() === book.title) return;

    setModalConfig({
      title: "Xác nhận cập nhật",
      message: `Cập nhật tựa sách thành "${newTitle.trim()}"?`,
      onConfirm: async () => {
        try {
          await updateBook(book.id, {
            title: newTitle.trim(),
            author_id: book.author_id,
          });
          const data = await getBooks();
          setBooks(data);
          setModalOpen(false);
          alert(`Đã cập nhật tựa sách thành công!`);
        } catch (err) {
          console.error(err);
          alert("Lỗi khi cập nhật sách!");
        }
      },
      isDanger: false,
      confirmText: "Đồng ý",
    });
    setModalOpen(true);
  };

  const handleDelete = (book) => {
    setModalConfig({
      title: "Xóa sách",
      message: `Sách "${book.title}" sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa?`,
      onConfirm: async () => {
        try {
          await deleteBook(book.id);
          const data = await getBooks();
          setBooks(data);
          setModalOpen(false);
          alert(`Đã xóa sách "${book.title}" thành công!`);
        } catch (err) {
          console.error(err);
          alert("Lỗi khi xóa sách!");
        }
      },
      isDanger: true,
      confirmText: "Xóa ngay",
    });
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6 w-full animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Books Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and manage the library collection.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search books by title..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500">
                  <th className="px-6 py-4 font-medium first:pl-6 w-16 text-center">
                    No
                  </th>
                  <th className="px-6 py-4 font-medium ">Title</th>
                  <th className="px-6 py-4 font-medium w-64">Author</th>
                  <th className="px-6 py-4 font-medium text-center w-48">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Trống. Không có sách nào.
                    </td>
                  </tr>
                ) : (
                  currentBooks.map((book, index) => (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {((currentPage - 1) * ITEMS_PER_PAGE + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {book.author_name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(book)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            <Pencil size={14} /> Update
                          </button>
                          <button
                            onClick={() => handleDelete(book)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {(currentPage - 1) * ITEMS_PER_PAGE +
                  (filteredBooks.length > 0 ? 1 : 0)}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredBooks.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {filteredBooks.length}
              </span>{" "}
              results
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-slate-700 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        {...modalConfig}
      />
    </>
  );
}
