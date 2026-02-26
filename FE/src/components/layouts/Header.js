import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bell,
  Heart,
  Store,
  Menu,
  X,
  Shield,
  ChevronDown,
  LogOut,
  UserCircle,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const Header = ({ selectedCity }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "ADMIN";
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <header className="bg-black sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ================= LOGO ================= */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Quick
            </span>
          </Link>

          {user ? (
            <>
              {/* ================= DESKTOP NAV ================= */}
              <nav className="hidden md:flex items-center space-x-4">
                {/* Location */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition">
                  <MapPin className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-300">
                    {selectedCity || "Chennai"}
                  </span>
                </div>

                {/* List Business → Everyone except ADMIN */}
                {!isAdmin && (
                  <Link
                    to="/register-service"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <Store className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-300">List Business</span>
                  </Link>
                )}

                {/* Admin Panel */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                  >
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-sm font-semibold text-white">
                      Admin
                    </span>
                  </Link>
                )}
              </nav>

              {/* ================= DESKTOP RIGHT ================= */}
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/notifications"
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Bell className="h-5 w-5 text-gray-300 hover:text-white" />
                </Link>

                <Link
                  to="/favourites"
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Heart className="h-5 w-5 text-gray-300 hover:text-red-500" />
                </Link>

                {/* ================= USER DROPDOWN ================= */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100"
                      >
                        <UserCircle className="h-5 w-5 text-gray-500" />
                        <span>User Profile</span>
                      </Link>

                      {/* Business → Everyone except ADMIN */}
                      {!isAdmin && (
                        <Link
                          to="/business-owner-dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100"
                        >
                          <Briefcase className="h-5 w-5 text-gray-500" />
                          <span>Business</span>
                        </Link>
                      )}

                      <Link
                        to="/bookings-made"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100"
                      >
                        <CheckCircle className="h-5 w-5 text-gray-500" />
                        <span>My Bookings</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-red-100 text-red-600"
                        >
                          <Shield className="h-5 w-5" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-5 w-5 text-gray-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= MOBILE MENU BUTTON ================= */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden md:block px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {user && isMenuOpen && (
        <div className="md:hidden bg-white text-black px-6 py-5 space-y-4 shadow-lg">
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="block font-medium"
          >
            Profile
          </Link>

          {!isAdmin && (
            <>
              <Link
                to="/register-service"
                onClick={() => setIsMenuOpen(false)}
                className="block font-medium"
              >
                List Business
              </Link>

              <Link
                to="/business-owner-dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block font-medium"
              >
                Business
              </Link>
            </>
          )}

          <Link
            to="/bookings-made"
            onClick={() => setIsMenuOpen(false)}
            className="block font-medium"
          >
            My Bookings
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block text-red-600 font-semibold"
            >
              Admin Panel
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
