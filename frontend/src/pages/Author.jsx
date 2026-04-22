import React, { useState, useEffect } from "react";
import { getAuthors, updateAuthor, deleteAuthor } from "../../api/authorApi";
import {
  Search,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Modal from "../components/Modal";

export default function Author() {
  const [searchTerm, setSearchTerm] = useState("");
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE),
  );
  const currentAuthors = filteredAuthors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    isDanger: false,
    confirmText: "",
  });

  useEffect(() => {
    // Fetch data from backend API using our client
    getAuthors()
      .then((data) => {
        setAuthors(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching authors:", err);
        setIsLoading(false);
      });
  }, []);

  const handleUpdate = (author) => {
    const newName = window.prompt(
      `Nhập tên mới cho tác giả "${author.name}":`,
      author.name,
    );
    if (!newName || newName.trim() === author.name) return;

    setModalConfig({
      title: "Xác nhận cập nhật",
      message: `Bạn có chắc chắn muốn cập nhật tên tác giả thành "${newName.trim()}"?`,
      onConfirm: async () => {
        try {
          // Gửi API update
          await updateAuthor(author.id, {
            name: newName.trim(),
            books: author.books,
          });
          // Fetch lại danh sách
          const data = await getAuthors();
          setAuthors(data);
          setModalOpen(false);
          alert(`Đã cập nhật tác giả thành công!`);
        } catch (err) {
          console.error(err);
          alert("Lỗi khi cập nhật tác giả!");
        }
      },
      isDanger: false,
      confirmText: "Đồng ý",
    });
    setModalOpen(true);
  };

  const handleDelete = (author) => {
    setModalConfig({
      title: "Xóa tác giả",
      message: `Tác giả "${author.name}" sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn muốn xóa?`,
      onConfirm: async () => {
        try {
          await deleteAuthor(author.id);
          const data = await getAuthors();
          setAuthors(data);
          setModalOpen(false);
          alert(`Đã xóa tác giả: ${author.name}`);
        } catch (err) {
          console.error(err);
          alert("Lỗi khi xóa tác giả!");
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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Authors Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage library authors and their details.
            </p>
          </div>
        </div>

        {/* Main Content Card: Tools + Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Tool Bar: Search & Filter */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search authors by name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table Area : No, Name, Books, Action */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500">
                  <th className="px-6 py-4 font-medium first:pl-6 w-16">No</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium w-32">Books</th>
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
                      Loading authors data from Database...
                    </td>
                  </tr>
                ) : (
                  currentAuthors.map((author, index) => (
                    <tr
                      key={author.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {((currentPage - 1) * ITEMS_PER_PAGE + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {author.name ? author.name.charAt(0) : "?"}
                          </div>
                          {author.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {author.books}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(author)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(author)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
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
                  (filteredAuthors.length > 0 ? 1 : 0)}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredAuthors.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {filteredAuthors.length}
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
