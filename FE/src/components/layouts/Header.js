import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  MapPin,
  User,
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

  return (
    <header className="bg-black sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO – always visible */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Quick
            </span>
          </Link>

          {/* ===== AUTHENTICATED HEADER ===== */}
          {user ? (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-4">
                <div className="group flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="h-4 w-4 text-gray-200 group-hover:text-black transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-black transition-colors">
                    {selectedCity || "Chennai"}
                  </span>
                </div>

                <Link
                  to="/register-service"
                 className="group flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Store className="h-4 w-4 text-gray-200 group-hover:text-black transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-black transition-colors">
                    List Business
                  </span>
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50"
                  >
                    <Shield className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">
                      Admin
                    </span>
                  </Link>
                )}
              </nav>

              {/* Desktop Right */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg hover:bg-gray-50"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>

                <Link
                  to="/favourites"
                  className="p-2 rounded-lg hover:bg-gray-50 group"
                >
                  <Heart
                    className="h-5 w-5 text-white fill-none transition-all
                      group-hover:text-red-500 group-hover:scale-110
                      group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                  />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 border"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Manage your account
                          </p>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <UserCircle className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                User Profile
                              </p>
                              <p className="text-xs text-gray-500">
                                View and edit profile
                              </p>
                            </div>
                          </Link>

                          <Link
                            to="/business-owner-dashboard"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Business{" "}
                              </p>
                              <p className="text-xs text-gray-500">
                                Manage your business
                              </p>
                            </div>
                          </Link>

                          <Link
                            to="/bookings-made"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <CheckCircle className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                My Bookings
                              </p>
                              <p className="text-xs text-gray-500">
                                View your bookings
                              </p>
                            </div>
                          </Link>

                          {user.role === "ADMIN" && (
                            <Link
                              to="/admin"
                              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="h-5 w-5 text-red-500" />
                              <div>
                                <p className="text-sm font-medium text-red-600">
                                  Admin Panel
                                </p>
                                <p className="text-xs text-red-400">
                                  System management
                                </p>
                              </div>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <LogOut className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Hamburger – ONLY when logged in */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-50"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </>
          ) : (
            /* ===== LOGGED OUT HEADER ===== */
            <Link
              to="/auth"
              className="hidden md:flex items-center space-x-2 px-4 py-2
                bg-gradient-to-r from-orange-400 to-red-500
                text-white rounded-lg"
            >
              <User className="h-4 w-4" />
              <span>Login / Sign Up</span>
            </Link>
          )}
        </div>
      </div>

      {/* ===== MOBILE MENU (only when logged in) ===== */}
      {user && isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <Link to="/profile" className="mobile-item">
            Profile
          </Link>
          <Link to="/business-owner-dashboard" className="mobile-item">
            Business
          </Link>
          <Link to="/bookings-made" className="mobile-item">
            My Bookings
          </Link>
          <Link to="/favourites" className="mobile-item">
            Favourites
          </Link>
          <button onClick={logout} className="mobile-item w-full text-left">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
