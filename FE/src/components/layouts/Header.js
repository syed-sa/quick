import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { MapPin, User, Bell, Heart, Store, Menu, X, Shield } from "lucide-react";
import {toast} from "react-toastify";

const Header = ({ selectedCity, setSelectedCity }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
 <header className="bg-white shadow-md">
  <div className="w-full flex items-center justify-between px-4 md:px-8 py-4">
    {/* Logo now fully left */}
    <Link to="/" className="text-2xl font-bold text-yellow-500">
      <span className="text-red-500">Quick</span>
    </Link>

    {/* Mobile Toggle */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden text-gray-700 focus:outline-none"
    >
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center space-x-6">
      <NavItems
        user={user}
        logout={logout}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
    </div>
  </div>

  {/* Mobile Dropdown */}
  {isMenuOpen && (
    <div className="md:hidden bg-white px-4 pb-4 space-y-4 border-t">
      <NavItems
        user={user}
        logout={logout}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        isMobile
      />
    </div>
  )}
</header>

  );
};

const NavItems = ({ user, logout, selectedCity, setSelectedCity, isMobile = false }) => (
  <>
    {/* Register Business */}
    <Link
      to="/register-service"
      className="flex items-center text-gray-600 hover:text-gray-900"
    >
      <Store className="h-5 w-5 mr-1" />
      <span className="text-sm font-medium">List Your Business</span>
    </Link>

    {/* Location Selector */}
    <div className="flex items-center text-gray-600">
      <MapPin className="h-4 w-4 mr-1" />
      <select
        className="bg-transparent border-none focus:outline-none text-sm"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option>Bangalore</option>
        <option>Chennai</option>
      </select>
      
    </div>

    {/* Admin Access - Only show for admin users */}
    {user && user.role === 'ADMIN' && (
      <Link
        to="/admin"
        className="flex items-center text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full"
      >
        <Shield className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">Admin Panel</span>
      </Link>
    )}

    {/* User / Notifications / Favourites */}
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
      {user ? (
        <div className="relative group">
          <div className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
            <User className="h-5 w-5 mr-1" />
            <span>Hello, {user.name}</span>
            {user.role === 'ADMIN' && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                Admin
              </span>
            )}
          </div>
          {!isMobile && (
            <div className="absolute right-0 top-full w-40 bg-white rounded-lg shadow-lg border z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg"
              >
                User Profile
              </Link>
              <Link
                to="/business-profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Business Profile
              </Link>
              <Link
                to="/booking-management"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Bookings
              </Link>
              {/* Admin Panel Link in Dropdown */}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 last:rounded-b-lg"
              >
                Logout
              </button>
            </div>
          )}
          {isMobile && (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg"
              >
                Profile
              </Link>
              <Link
                to="/business-profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Business Profile
              </Link>
              <Link
                to="/booking-management"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Bookings
              </Link>
              {/* Admin Panel Link in Mobile Menu */}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      ) : (
        <Link
          to="/auth"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <User className="h-4 w-4 mr-1" />
          <span>Login / Sign Up</span>
        </Link>
      )}

      <a href="/notifications" className="text-gray-600 hover:text-gray-900 flex items-center">
        <Bell className="h-5 w-5" />
      </a>

     <Link to="/favourites" className="flex items-center">
  <Heart className="h-5 w-5" fill="red" stroke="red" />
</Link>

    </div>
  </>
);

export default Header;