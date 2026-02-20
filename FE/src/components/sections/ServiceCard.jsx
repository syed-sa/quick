import React, { useState, useEffect } from "react";
import { Clock, Camera, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const images = service.images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/service-details/${service.id}`, {
      state: { service, images },
    });
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length,
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* IMAGE SECTION */}
      <div className="relative h-56 overflow-hidden">
          {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={service.companyName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "";
              }}
            />

            {/* IMAGE CONTROLS */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-1.5 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-1.5 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
                >
                  ›
                </button>

                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <Camera className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* RATING BADGE */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-900">
            {service.rating || "4.8"}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {service.companyName}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description ||
            "Professional service provider offering quality solutions."}
        </p>

        {/* INFO */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-orange-500" />
            {service.workingHours || "9 AM - 5 PM"}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleViewDetails}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          View Details <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
