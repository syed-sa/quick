  import { Routes, Route } from "react-router-dom";
  import Header from "./components/layouts/Header";
  import Footer from "./components/layouts/Footer";
  import HomePage from "./pages/HomePage";
  import AuthForm from "./components/auth/AuthForm";
  import Favorites from "./pages/Favorites";
  import UserProfile from "./pages/Profile";
  import RegisterService from "./pages/RegisterService";
  import PrivateRoute from "./components/auth/PrivateRoute";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useState } from "react";
  import ServicesPage from "./pages/ServicePage";
  import ServiceDetailPage from "./pages/ServiceDetailPage";
  import BookingManagement from "./components/sections/BookingManagement";
  import NotificationPage from "./pages/Notification";
  import AdminDashboard from "./pages/Admin";
  import { useNotificationSocket } from "./hooks/useNotificationSocket";
  import VerifyEmail from "./components/auth/VerifyEmail"
  import ResetPassword from "./components/auth/ResetPassword";
  import BuisnessProfile from "./pages/BusinessOwnerDashboard";
import MyBookings from "./pages/MyBookings";
import QuickLinksPage from "./pages/QuickLinksPage";

  function App() {
    const [selectedCity, setSelectedCity] = useState("Chennai");
    useNotificationSocket();

  return (
    <div className="flex flex-col min-h-screen">
       <ToastContainer
        position="top-center"
        autoClose={3000} // 3 seconds
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      <Routes>
        <Route path="/" element={<HomePage selectedCity={selectedCity} />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/favourites" element={  <Favorites />} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/service-details/:id" element={<ServiceDetailPage />} />
        <Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} />
        <Route path="/admin" element = { <PrivateRoute><AdminDashboard/></PrivateRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register-service" element={  <PrivateRoute><RegisterService /></PrivateRoute>} />
        <Route path="/business-owner-dashboard" element={<PrivateRoute><BuisnessProfile /></PrivateRoute>} />
        <Route path="/bookings-made" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/quick-links" element={<QuickLinksPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
