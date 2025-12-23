import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ServiceCard from "../components/sections/ServiceCard";
import api from "../components/auth/axios";
import { Camera, Search } from "lucide-react";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const postalCode = searchParams.get("postalCode") || "";
  const area = searchParams.get("area") || "";

  useEffect(() => {
    const fetchServices = async () => {
      if (!category || !postalCode) {
        toast.error("Invalid search parameters");
        navigate("/");
        return;
      }
      const token = localStorage.getItem("token");

      try {
        const response = await api.get(
          "http://localhost:8080/api/services/getByCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Access token here
            },
            params: {
              postalCode,
              categoryName: category, // No need to manually encode — axios does it
            },
          }
        );
        if (response.status === 200) {
          const data = response.data;
          setServices(data);
        } else {
          toast.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Error loading services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category, postalCode, navigate]);

  if (loading) {
    return (
      <main className="flex-grow min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin mx-auto"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-500 border-l-cyan-500 rounded-full animate-spin mx-auto mt-2 ml-2"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Finding amazing services
              </p>
              <p className="text-gray-600">
                Please wait while we load your results...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-50">
      {/* Header matching your current style */}
      <header className="bg-gradient-to-r from-white via-red-100 to-white border-b shadow-md">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-6 flex flex-col gap-3 sm:gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-sm font-medium text-black-500 hover:text-red-500 transition-all duration-200 group w-fit"
          >
            <svg
              className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Search</span>
          </button>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight capitalize flex items-center gap-2">
            <span className="bg-red-100 text-orange-600 px-2 py-0.5 text-sm font-semibold rounded">
              {category} Services
            </span>
          </h1>

          {/* Summary */}
          <p className="text-sm sm:text-base text-gray-600">
            <span className="text-gray-800 font-semibold">
              {services.length}
            </span>{" "}
            result{services.length !== 1 ? "s" : ""} found in
            <span className="text-gray-800 font-semibold mx-1">{area}</span>(
            <span className="text-gray-800">{postalCode}</span>)
          </p>
        </div>
      </header>

      {/* Services Grid Section */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative inline-block mb-8">
              <div className="bg-white rounded-full p-8 shadow-lg border">
                <Camera className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-800">
                No services found
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We couldn't find any services matching your criteria. Try
                adjusting your search or exploring nearby areas.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span>Search Again</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={service.id || index}
                className="transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
};

export default ServicesPage;
