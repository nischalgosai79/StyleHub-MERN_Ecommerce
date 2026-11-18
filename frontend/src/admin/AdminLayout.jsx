
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Sidebar */}
      <aside className="w-full bg-[#17251f] p-6 text-white md:min-h-screen md:w-64">
        <Link to="/admin" className="text-2xl font-black">
          STYLE<span className="text-emerald-400">HUB</span>
        </Link>

        <p className="mb-8 mt-2 text-xs uppercase tracking-widest text-gray-400">
          Admin Panel
        </p>

        <nav className="flex flex-wrap gap-3 md:flex-col">
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/10"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/10"
          >
            <Package size={18} />
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/10"
          >
            <ShoppingCart size={18} />
            Orders
          </Link>

          {/* Store Settings */}
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/10"
          >
            <Settings size={18} />
            Store Settings
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-white/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Page Content */}
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
