import React, { useState, useEffect } from 'react';
import { Clock, Camera } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
const handleViewDetails = (service, images) => {
  navigate(`/service/${service.id}`, { state: { service,images } }); //service detail page is called here passing the service
};
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/services/getImages?serviceId=${service.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.ok) {
          const imageData = await response.json();
          setImages(Array.isArray(imageData) ? imageData : []);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoadingImages(false);
      }
    };

    if (service.id) {
      fetchImages();
    } else {
      setLoadingImages(false);
    }
  }, [service.id]);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };



  return (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
onClick={() => handleViewDetails(service, images)}          
>
          View Details
        </button>
      </div>
        {loadingImages ? (
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={service.serviceName || service.name || 'Service'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder image on error
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEyMCA4MEwxNDAgMTAwTDEyMCAxMjBMMTAwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Next image"
                >
                  →
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Camera className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Content Section */}
     <div className="p-6 space-y-3">
      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
        </h3>
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">
        {service.companyName || 'Service Name'}
      </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
        {service.description || 'Professional service description goes here...'}
      </p>

     <div className="flex items-center justify-between pt-2">
        <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
              <span className="line-clamp-1">{service.workingHours||"9-5"}</span>
            </div>
        <span className="text-sm text-gray-500">
          ⭐ {service.rating || '4.8'}
        </span>
        </div>

        {/* Action Button */}
       
      </div>
    </div>
  );
};

export default ServiceCard;