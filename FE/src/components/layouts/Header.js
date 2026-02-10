import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { MapPin, User, Bell, Heart, Store, Menu, X, Shield, ChevronDown, LogOut, UserCircle, Briefcase, Calendar,Eye,CheckCircle } from "lucide-react";

const Header = ({ selectedCity, setSelectedCity }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Quick
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Location Selector */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{selectedCity || "Chennai"}</span>
            </div>

            {/* List Business */}
            <Link
              to="/register-service"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <Store className="h-4 w-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                List Your Business
              </span>
            </Link>

            {/* Admin Panel - Badge Style */}
            {user && user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-red-600">Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Notifications */}
            <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Favorites */}
            <Link to="/favourites" className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5 text-red-500" fill="red" stroke="red" />
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name}
                    </p>
                    {user.role === 'ADMIN' && (
                      <p className="text-xs text-red-600 font-medium">Admin</p>
                    )}
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
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircle className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">User Profile</p>
                            <p className="text-xs text-gray-500">View and edit profile</p>
                          </div>
                        </Link>

                        <Link
                          to="/business-owner-dashboard"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Briefcase className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Business </p>
                            <p className="text-xs text-gray-500">Manage your business</p>
                          </div>
                        </Link>

                     
                        <Link
                          to="/bookings-made"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <CheckCircle className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">My Bookings</p>
                            <p className="text-xs text-gray-500">View your bookings</p>
                          </div>
                        </Link>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="text-sm font-medium text-red-600">Admin Panel</p>
                              <p className="text-xs text-red-400">System management</p>
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
                          <span className="text-sm font-medium text-gray-700">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Login / Sign Up</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {/* Location */}
            <div className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg bg-gray-50">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{selectedCity || "Chennai"}</span>
            </div>

            {/* List Business */}
            <Link
              to="/register-service"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Store className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">List Your Business</span>
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      {user.role === 'ADMIN' && (
                        <p className="text-xs text-red-600 font-medium">Admin</p>
                      )}
                    </div>
                  </div>
                </div>

                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">User Profile</span>
                </Link>

                <Link 
                  to="/business-owner-dashboard" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Business</span>
                </Link>

     

                <Link 
                  to="/bookings-made" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CheckCircle className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">My Bookings</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600">Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 w-full text-left border-t border-gray-200"
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Login / Sign Up</span>
              </Link>
            )}

            <div className="flex items-center space-x-4 px-4 pt-3 border-t border-gray-200">
              <Link 
                to="/notifications" 
                className="relative p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link 
                to="/favourites" 
                className="p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-6 w-6 text-red-500" fill="red" stroke="red" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;