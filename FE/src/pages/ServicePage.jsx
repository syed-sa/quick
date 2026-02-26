import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ServiceCard from "../components/sections/ServiceCard";
import api from "../components/auth/axios";
import { Camera, Search } from "lucide-react";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const viewAll = searchParams.get("view") === "all";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const keyWord = searchParams.get("keyWord") || "";
  const postalCode = searchParams.get("postalCode") || "";
  const area = searchParams.get("area") || "";

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("token");
      // --- NEW VIEW ALL MODE ---
      if (viewAll) {
        try {
          const response = await api.get(
            "http://localhost:8080/api/services/all",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setServices(response.data || []);
        } catch (err) {
          console.error("Error loading all services:", err);
          toast.error("Error loading services");
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!viewAll && category) {
        try {
          const response = await api.get(
            "http://localhost:8080/api/services/all",
            { params: { category } }
          );
          setServices(response.data || []);
          setLoading(false);
        } catch (err) {
          toast.error("Error loading category services");
          setLoading(false);
        }
        return;
      }
      
      if (!keyWord || !postalCode) {
        toast.error("Invalid search parameters");
        navigate("/");
        return;
      }
      try {
        const response = await api.get(
          "http://localhost:8080/api/services/getByCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              keyWord,
              postalCode,
              page: 0,
              size: 10,
            },
          }
        );

        const pageData = response.data;
        console.log("Services from API:", pageData.content);

        setServices(pageData.content || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Error loading services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [keyWord, postalCode, navigate, category, viewAll]);

  if (loading) {
    return (
      <main className="flex-grow min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading services...</p>
      </main>
    );
  }
return (
  <main className="flex-grow min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    {/* COMPACT HERO HEADER */}
    <header className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Elegant Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2.5 text-white/90 hover:text-white transition-all mb-4 group"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 border border-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">Back to Search</span>
        </button>

        {/* Compact Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {viewAll
                ? "All Available Services"
                : keyWord || category}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-white/90">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                <span className="font-bold text-lg text-white">{services.length}</span>
                <span className="text-sm font-medium">
                  {services.length === 1 ? "Service" : "Services"}
                </span>
              </div>
              
              {!viewAll && (area || category) && (
                <div className="inline-flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{area || category}</span>
                  {postalCode && (
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider">
                      {postalCode}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filters Button */}
          <button className="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-white/95 px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Smooth Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0 -mb-px">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40H1440V0C1440 0 1080 40 720 40C360 40 0 0 0 0V40Z" fill="rgb(249, 250, 251)"/>
        </svg>
      </div>
    </header>

    {/* RESULTS SECTION */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {services.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md mx-auto border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5 transform rotate-3">
              <Camera className="h-8 w-8 text-orange-500 transform -rotate-3" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Try adjusting your search criteria
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-red-500 transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              New Search
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Load More */}
          {services.length >= 9 && (
            <div className="mt-10 text-center">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl transition-all font-semibold text-sm shadow-md hover:shadow-lg border border-gray-200">
                Load More Services
              </button>
            </div>
          )}
        </>
      )}
    </section>
  </main>
);
};

export default ServicesPage;
