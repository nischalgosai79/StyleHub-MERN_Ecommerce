import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  UserRound,
  LogOut,
} from "lucide-react";

import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { getSiteSettings } from "../api/siteSettingsApi";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState({
    storeName: "StyleHub",
    logo: "",
    announcement: "",
  });

  const { cartCount, wishlist } = useStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch store settings from the backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();

        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Failed to load store settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      search.trim()
        ? `/shop?search=${encodeURIComponent(search.trim())}`
        : "/shop"
    );

    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition hover:text-emerald-700 ${
      isActive ? "text-emerald-700" : "text-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-[#f8f5ef]/95 backdrop-blur">

      {/* Announcement Bar */}
      {settings.announcement && (
        <div className="bg-[#17251f] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
          {settings.announcement}
        </div>
      )}

      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-5 py-4 md:px-10 lg:px-16">

        {/* Dynamic Store Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          {settings.logo ? (
            <img
              src={settings.logo}
              alt={settings.storeName || "Store Logo"}
              className="max-h-12 max-w-[180px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl font-black tracking-tight">
              {settings.storeName || "StyleHub"}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden max-w-xs flex-1 items-center rounded-full border border-gray-200 bg-white px-4 py-2 xl:flex"
        >
          <Search size={17} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="ml-2 w-full bg-transparent text-sm outline-none"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link
            to="/wishlist"
            className="relative text-gray-700 hover:text-emerald-700"
            aria-label="Wishlist"
          >
            <Heart size={21} />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-emerald-700"
            aria-label="Cart"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to={user.role === "admin" ? "/admin" : "/my-orders"}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-700"
              >
                <UserRound size={18} />
                {user.name?.split(" ")[0] || "Account"}
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 md:block"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-[#f8f5ef] px-6 py-6 lg:hidden">
          <form
            onSubmit={handleSearch}
            className="mb-5 flex items-center rounded-xl border bg-white px-4 py-3"
          >
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="ml-2 w-full bg-transparent outline-none"
            />
          </form>

          <nav className="flex flex-col gap-5">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/my-orders"}
                  onClick={() => setMobileOpen(false)}
                  className="font-semibold"
                >
                  {user.role === "admin" ? "Admin Dashboard" : "My Orders"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left font-semibold text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="font-semibold text-emerald-700"
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
