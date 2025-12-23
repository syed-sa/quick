import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../components/auth/axios";
import BookingCard from "../components/sections/BookService";
const ServiceDetailPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [service, setService] = useState(state?.service || null);
  const [loading, setLoading] = useState(!state?.service);
  const [images] = useState(state?.images || null);
  const [showBooking, setShowBooking] = useState(false);

  // Mock data for demonstration - replace with actual service data

  const mockReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Exceptional service! The team was professional, punctual, and exceeded my expectations. Highly recommended!",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      comment:
        "Great experience overall. Quality work and fair pricing. Will definitely use their services again.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      comment:
        "Outstanding attention to detail and customer service. They went above and beyond to ensure everything was perfect.",
      date: "2 months ago",
    },
  ];

  // Fetch service data if not available from navigation state
  useEffect(() => {
    if (!service && id) {
      const fetchService = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await api.get(
            `http://localhost:8080/api/services/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setService(response.data);
          } else {
            toast.error("Failed to fetch service details");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching service:", error);
          toast.error("Error loading service details. Please try again.");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [id, service, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Service Data
          </h2>
          <p className="text-gray-600 mb-8">
            Please go back and select a service again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const averageRating =
    mockReviews.reduce((acc, review) => acc + review.rating, 0) /
    mockReviews.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Name & Location */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {service.companyName || "Premium Business Services"}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-lg">
                  {service.address ||
                    "123 Business District, Professional Plaza"}
                </span>
              </div>
              <div className="text-gray-500">
                {service.city || "Downtown"} - {service.postalCode || "12345"}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 mb-4">
                  <img
                    src={images[currentImageIndex]}
                    alt={currentImageIndex + 1}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Thumbnail Strip */}
                <div className="flex space-x-3 mt-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? "border-blue-500 scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About Our Services
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  We are dedicated to providing exceptional service that exceeds
                  your expectations. Our team of experienced professionals
                  combines industry expertise with personalized attention to
                  deliver results that matter.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  With years of experience in the industry, we understand what
                  it takes to deliver quality results on time and within budget.
                  Our commitment to excellence and customer satisfaction sets us
                  apart from the competition.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whether you're looking for a one-time service or ongoing
                  support, we're here to help you achieve your goals with
                  professionalism and reliability you can trust.
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-l font-bold text-gray-900">
                  Customer Reviews
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {averageRating.toFixed(1)} ({mockReviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.name}
                          </h4>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-0.5xl text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Contact Information */}
             

              {/* Book Service Button */}
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Book our premium services today and experience the
                    difference.
                  </p>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-white text-gray-900 font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Request Service Now</span>
                  </button>
                  <p className="text-blue-200 text-sm mt-4">
                    Free consultation • Quick response • Professional service
                  </p>
                </div>
              </div>

              {/* Booking Modal - Shown Conditionally */}
              {showBooking && (
                <BookingCard
                  customerId={parseInt(localStorage.getItem("userId"), 10)}
                  serviceId={service.id}
                  serviceName={service.companyName}
                  onClose={() => setShowBooking(false)}
                />
              )}

              {/* Additional CTA */}
              <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
                <p className="text-gray-600 mb-4">Need a custom quote?</p>
                <button className="text-black-600 hover:text-black-700 font-semibold transition-colors duration-200">
                  Request Custom Quote →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
