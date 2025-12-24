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

  const keyWord = searchParams.get("keyWord") || "";
  const postalCode = searchParams.get("postalCode") || "";
  const area = searchParams.get("area") || "";

  useEffect(() => {
    const fetchServices = async () => {
      if (!keyWord || !postalCode) {
        toast.error("Invalid search parameters");
        navigate("/");
        return;
      }
    const token = localStorage.getItem("token");
      try {
        const response = await api.get(
          "http://localhost:8080/api/services/getByCategory",
          {  headers: {
              Authorization: `Bearer ${token}`, // ✅ Access token here
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
        setServices(pageData.content || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Error loading services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [keyWord, postalCode, navigate]);

  if (loading) {
    return (
      <main className="flex-grow min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading services...</p>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-red-100 to-white border-b shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:text-red-500"
          >
            ← Back to Search
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Results for "{keyWord}"
          </h1>

          <p className="text-sm text-gray-600">
            <strong>{services.length}</strong> result(s) found in{" "}
            <strong>{area}</strong> ({postalCode})
          </p>
        </div>
      </header>

      {/* Results */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              No services found
            </h3>
            <button
              onClick={() => navigate("/")}
              className="mt-4 inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ServicesPage;
