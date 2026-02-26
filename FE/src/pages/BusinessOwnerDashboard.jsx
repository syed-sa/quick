import React, { useEffect, useState } from 'react';
import {
  Building2, MapPin, Phone, Mail, Globe, MapIcon, Hash, Save, Edit3, Star,
  Calendar, User, Check, X, Eye, Filter, Search, ChevronDown,
  AlertCircle, CheckCircle, XCircle, Store, Package
} from 'lucide-react';
import api from '../components/auth/axios';

const BusinessOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Business Profile State
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch Business Profile
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log("Fetching business profile for userId:", userId);
    const fetchBusinessProfile = async () => {
      try {
        const res = await api.get(`services/getservice/userId/${userId}`);
        const data = res.data;
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedBusinessId(data[0].id);
          setFormData(data[0]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  // Fetch Bookings based on selected business
  useEffect(() => {
    if (selectedBusinessId) {
      api.get(`bookservice/GetBookingRequests/${selectedBusinessId}`)
        .then(res => {
          setBookings(res.data || []);
          setFilteredBookings(res.data || []);
        })
        .catch(error => {
          console.error("Error fetching bookings:", error);
          setBookings([]);
          setFilteredBookings([]);
        });
    }
  }, [selectedBusinessId]);

  // Filter Bookings
  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.bookingStatus === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, searchTerm, bookings]);

  // Business Profile Handlers
  const handleSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedBusiness = businesses.find(b => b.id === selectedId);
    setSelectedBusinessId(selectedId);
    setFormData(selectedBusiness);
    setIsEditing(false);
    // Reset booking filters when switching businesses
    setStatusFilter("all");
    setSearchTerm("");
    setSelectedBooking(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    await api.put(`services/updateService`, formData)
      .then(response => {
        console.log("Business updated successfully:", response.data);
      })
      .catch(error => {
        console.error("Error updating business:", error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    const originalBusiness = businesses.find(b => b.id === selectedBusinessId);
    setFormData(originalBusiness);
    setIsEditing(false);
  };

  // Booking Handlers
  const handleStatus = async (id, status) => {
    try {
      setProcessingId(id);
      await api.post(`bookservice/UpdateBookingStatus/${id}?status=${status}`);
      setBookings(prev =>
        prev.map(b =>
          b.id === id ? { ...b, bookingStatus: status } : b
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "accepted": return <CheckCircle className="h-4 w-4" />;
      case "rejected":
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Calculate Stats
  const pendingCount = bookings.filter(b => b.bookingStatus === "pending").length;
  const acceptedCount = bookings.filter(b => b.bookingStatus === "accepted").length;
  const totalCount = bookings.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No business profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Business Info & Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          {/* Top Section - Business Overview */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{formData.companyName}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formData.city}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(formData.rating || 0)
                              ? 'text-yellow-300 fill-current'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">
                        {formData.rating || 0} ({formData.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Selector */}
              {businesses.length > 1 && (
                <div className="flex flex-col items-end">
                  <label className="text-white/80 text-xs mb-1 font-medium">Switch Business</label>
                  <select
                    className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[250px]"
                    value={selectedBusinessId}
                    onChange={handleSelectChange}
                  >
                    {businesses.map(business => (
                      <option key={business.id} value={business.id} className="text-gray-900 bg-white">
                        {business.companyName} - {business.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 bg-gray-50">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Accepted</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{acceptedCount}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Booking Requests</span>
                  {pendingCount > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>Business Profile</span>
                </div>
              </button>

              {businesses.length > 1 && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>All Businesses</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {businesses.length}
                    </span>
                  </div>
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      className="pl-10 w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Search by service or notes..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      className="pl-10 pr-10 w-full border border-gray-300 rounded-xl p-3 appearance-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl py-16 text-center">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests found</h3>
                      <p className="text-gray-500">
                        {statusFilter !== 'all' 
                          ? `No ${statusFilter} bookings to display`
                          : 'Your booking requests will appear here'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredBookings.map(b => (
                      <div
                        key={b.id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-md">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{b.serviceName}</h3>
                              <p className="text-sm text-gray-500">Booking ID: #{b.id}</p>
                            </div>
                          </div>

                          <div className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(b.bookingStatus)}`}>
                            {getStatusIcon(b.bookingStatus)}
                            {b.bookingStatus?.toUpperCase()}
                          </div>
                        </div>

                        {b.description && (
                          <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">Customer Notes:</span> {b.description}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-white hover:border-gray-400 transition-colors"
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </button>

                          <div className="flex gap-2">
                            {b.bookingStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatus(b.id, "accepted")}
                                  disabled={processingId === b.id}
                                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                  <Check className="h-4 w-4" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStatus(b.id, "rejected")}
                                  disabled={processingId === b.id}
                                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </button>
                              </>
                            )}

                            {b.bookingStatus === "accepted" && (
                              <button
                                onClick={() => handleStatus(b.id, "cancelled")}
                                disabled={processingId === b.id}
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                              >
                                <X className="h-4 w-4" />
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Business Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Quick Info Card */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-5 w-5 mr-3 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <p className="font-semibold">{formData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-5 w-5 mr-3 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="font-semibold">{formData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Globe className="h-5 w-5 mr-3 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Website</p>
                          <p className="font-semibold">{formData.website || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Hash className="h-5 w-5 mr-3 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Postal Code</p>
                          <p className="font-semibold">{formData.postalCode || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {!isEditing && (
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm ml-4"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900">Edit Business Information</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Building2 className="h-4 w-4 inline mr-1.5" />
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <MapPin className="h-4 w-4 inline mr-1.5" />
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Phone className="h-4 w-4 inline mr-1.5" />
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="h-4 w-4 inline mr-1.5" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Globe className="h-4 w-4 inline mr-1.5" />
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Hash className="h-4 w-4 inline mr-1.5" />
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <MapIcon className="h-4 w-4 inline mr-1.5" />
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Display (when not editing) */}
                {!isEditing && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <MapIcon className="h-5 w-5 mr-2 text-red-500" />
                      Business Address
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{formData.address || 'No address provided'}</p>
                  </div>
                )}
              </div>
            )}

            {/* All Businesses Overview Tab */}
            {activeTab === 'overview' && businesses.length > 1 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Businesses</h2>
                  <p className="text-gray-600">Manage all your businesses from one place</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businesses.map((business) => (
                    <div
                      key={business.id}
                      className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-6 transition-all cursor-pointer ${
                        business.id === selectedBusinessId
                          ? 'border-red-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => {
                        setSelectedBusinessId(business.id);
                        setFormData(business);
                        setIsEditing(false);
                        setStatusFilter("all");
                        setSearchTerm("");
                        setActiveTab('bookings');
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl mr-4 ${
                            business.id === selectedBusinessId
                              ? 'bg-red-100'
                              : 'bg-gray-100'
                          }`}>
                            <Building2 className={`h-8 w-8 ${
                              business.id === selectedBusinessId
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{business.companyName}</h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(business.rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {business.rating || 0} ({business.reviews || 0})
                              </span>
                            </div>
                          </div>
                        </div>
                        {business.id === selectedBusinessId && (
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{business.city}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{business.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm truncate">{business.email}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBusinessId(business.id);
                            setFormData(business);
                            setIsEditing(false);
                            setStatusFilter("all");
                            setSearchTerm("");
                            setActiveTab('bookings');
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          View Dashboard
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
                    >
                      <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                      <p className="font-semibold text-gray-900">View All Bookings</p>
                      <p className="text-sm text-gray-600 mt-1">Manage customer requests</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
                    >
                      <Edit3 className="h-6 w-6 text-blue-600 mb-2" />
                      <p className="font-semibold text-gray-900">Edit Profile</p>
                      <p className="text-sm text-gray-600 mt-1">Update business info</p>
                    </button>
                    <div className="bg-white border border-blue-200 rounded-lg p-4">
                      <Store className="h-6 w-6 text-blue-600 mb-2" />
                      <p className="font-semibold text-gray-900">Total Businesses</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{businesses.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Details</h2>
                <p className="text-gray-600">{selectedBooking.serviceName}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Booking ID</p>
                  <p className="text-gray-900">#{selectedBooking.id}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.bookingStatus)}`}>
                    {selectedBooking.bookingStatus?.toUpperCase()}
                  </div>
                </div>

                {selectedBooking.description && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Customer Notes</p>
                    <p className="text-gray-900">{selectedBooking.description}</p>
                  </div>
                )}

                {selectedBooking.bookingStatus === "accepted" && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-green-900 font-bold mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Customer Contact Information
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-green-800">
                        <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">{selectedBooking.phone}</span>
                      </div>
                      <div className="flex items-center text-green-800">
                        <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">{selectedBooking.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBooking.bookingStatus === "pending" && selectedBooking.location && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-start text-blue-900">
                      <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Service Location</p>
                        <p className="text-blue-800">{selectedBooking.location}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOwnerDashboard;