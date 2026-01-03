import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../components/auth/axios";
import ServiceCard from "../components/sections/ServiceCard";

const Favorites = () => {
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    if (!userId) {
      toast.error("Please login to view favorites");
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(`/users/${userId}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFavoriteServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (serviceId) => {
    setRemovingId(serviceId);
    try {
      await api.delete(`/users/${userId}/favorites/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setFavoriteServices(favoriteServices.filter(service => service.id !== serviceId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewService = (service) => {
    navigate(`/service/${service.id}`, {
      state: {
        service: service,
        images: service.images || []
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-gray-900">Your Favorites</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {favoriteServices.length} saved {favoriteServices.length === 1 ? 'service' : 'services'}
          </p>
        </div>

        {favoriteServices.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="max-w-md mx-auto">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Favorites Yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start exploring services and save your favorites for easy access later.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Explore Services
              </button>
            </div>
          </div>
        ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Load More */}
          {favoriteServices.length >= 9 && (
            <div className="mt-10 text-center">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl transition-all font-semibold text-sm shadow-md hover:shadow-lg border border-gray-200">
                Load More Services
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};
export default Favorites;