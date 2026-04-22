import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Users,
  Book,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, title, links }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActiveGroup = links.some(
    (link) =>
      location.pathname === link.path ||
      location.pathname.startsWith(`${link.path}/`),
  );

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200 ${
          isActiveGroup
            ? "text-white"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={isActiveGroup ? "text-indigo-400" : ""} />
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
      >
        <div className="pl-11 pr-4 py-1 space-y-1">
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={idx}
                to={link.path}
                className={`block py-2 px-3 text-sm rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "text-white bg-slate-800 font-medium border-l-4 border-indigo-500 rounded-none rounded-r-lg -ml-[2px] pl-[14px]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <Book size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              Thanh Tung
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">
            Quản trị viên
          </div>

          <SidebarItem
            icon={Users}
            title="Authors"
            links={[
              { label: "Authors List", path: "/authors" },
              { label: "Create Author", path: "/authors/create" },
            ]}
          />

          <SidebarItem
            icon={Book}
            title="Books"
            links={[
              { label: "Books List", path: "/books" },
              { label: "Add Book", path: "/books/add" },
            ]}
          />

          <SidebarItem
            icon={MessageSquare}
            title="Reviews"
            links={[
              { label: "All Reviews", path: "/reviews" },
              { label: "Create Review", path: "/reviews/create" },
            ]}
          />
        </div>

        {/* User Profile Summary */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold">
              AM
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin Tung</p>
              <p className="text-xs text-slate-500">
                thanhtung26042004@gmail.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
