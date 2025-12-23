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
  import BusinessProfile from "./pages/BuisnessProfile";
  import BookingManagement from "./components/sections/BookingManagement";
  import NotificationPage from "./pages/Notification";
  import AdminDashboard from "./pages/Admin";
  import { useNotificationSocket } from "./hooks/useNotificationSocket";

  function App() {
    const [selectedCity, setSelectedCity] = useState("Mumbai");
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
        <Route path="/favourites" element={<Favorites />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/admin" element = {<AdminDashboard/>} />

        <Route
          path="/register-service"
          element={
            <PrivateRoute>
              <RegisterService />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
