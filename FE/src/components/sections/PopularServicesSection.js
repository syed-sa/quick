import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PopularServicesSection = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  
  const popularServices = [
    { id: "AC Repair", name: "AC Repair", image: "/images/ac-repair.jpg" },
    { id: "Plumbing", name: "Plumbing", image: "/images/plumber.jpg" },
    { id: "Electrical", name: "Electrical", image: "/images/electrician.png" },
    { id: "House Cleaning", name: "House Cleaning", image: "/images/cleaning.jpg" },
    { id: "Car Service", name: "Car Service", image: "/images/car-service.png" },
    { id: "Packers & Movers", name: "Packers & Movers", image: "/images/packers-movers.png" },
  ];

  const handleImageError = (serviceId) => {
    setImageErrors((prev) => ({ ...prev, [serviceId]: true }));
  };

  const getPlaceholderIcon = (serviceName) => {
    const iconMap = {
      "AC Repair": "❄️",
      Plumbing: "🔧",
      Electrical: "⚡",
      "House Cleaning": "🧽",
       "Car Service": "🏎️", 
      "Packers & Movers": "📦",
    };
    return iconMap[serviceName] || "🔧";
  };

  // 🟡 Handle category navigation
  const handleCategoryClick = (category) => {
    navigate(`/services?view=category&category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-16 rounded-t-3xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-orange-600 mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Trending Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Popular Services
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Trusted by <span className="font-semibold text-orange-600">50,000+</span> satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {popularServices.map((service) => (
            <button
              key={service.id}
              className="group flex flex-col items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white border border-white/50 hover:border-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:scale-105"
              aria-label={`Browse ${service.id}`}
              onClick={() => handleCategoryClick(service.id)}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm mb-4 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative group-hover:border-orange-200 transition-colors">
                {imageErrors[service.id] ? (
                  <span className="text-2xl md:text-3xl" role="img" aria-label={service.name}>
                    {getPlaceholderIcon(service.name)}
                  </span>
                ) : (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => handleImageError(service.id)}
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>

              <span className="text-sm md:text-base font-semibold text-gray-700 text-center leading-tight group-hover:text-orange-600 transition-colors">
                {service.name}
              </span>

              <div className="w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 group-hover:w-8 transition-all duration-300 mt-2 rounded-full"></div>
            </button>
          ))}
        </div>

        {/* 🔵 VIEW ALL — no category param */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need something else?</p>
          <button
            onClick={() => navigate("/services?view=all")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            View All Services →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularServicesSection;
