import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Check, 
  X, 
  Eye, 
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Store,
  UserCheck,
  Building,
  MapPin
} from 'lucide-react';
import api from '../auth/axios';

const UnifiedBookingManagement = () => {
  const [bookings, setBookings] = useState({received: [], made: []});
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    getBookings(userId);
  }, []);

  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    setFilteredBookings(bookings[activeTab] || []);
  }, []);

  // Filter bookings when tab changes
  useEffect(() => {
    setFilteredBookings(bookings[activeTab] || []);
    setStatusFilter('all');
    setSearchTerm('');
  }, [activeTab, bookings]);

  // Filter bookings based on status and search term
  useEffect(() => {
    let filtered = bookings[activeTab] || [];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const searchFields = [
          booking.serviceName,
          booking.description
        ];
        
        return searchFields.some(field => 
          field && field.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchTerm, activeTab]);

  const handleStatus = async (bookingId, status) => {
    try {
      // Simulate API call
    
        const response =   await api.post(`bookservice/UpdateBookingStatus/${bookingId}?status=${status}`);

      if(response.status == 200)
      {
console.log("W");
      }
      // Update local state
      setBookings(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(booking => 
          booking.id === bookingId 
            ? { ...booking, bookingStatus: status }
            : booking
        )
      }));
      
    } catch (error) {
      console.error("Failed to update booking status:", error);
    } finally {
      setProcessingId(null);    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBookedAt = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTabCount = (tab) => {
    return bookings[tab]?.length || 0;
  };

  async function getBookings(userId) {
    try {
      // Fetch received bookings from API or state
      const receivedBookings = await api.get(`bookservice/GetBookingRequests/${userId}`);
      const madeBookings = await api.get(`bookservice/GetMyBookings/${userId}`);
      setBookings({
        received: receivedBookings.data || [],
        made: madeBookings.data || []
      });
    } catch (error) {
      console.error("Failed to fetch received bookings:", error);
    }
  }

  const renderContactDetails = (booking) => {
    if (booking.bookingStatus === 'accepted') {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-800 font-medium">
              Your request has been accepted! Here are the contact details:
            </p>
          </div>
          <div className="space-y-2 ml-7">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-green-600" />
              <a href={`tel:${booking.phone}`} className="text-green-700 hover:text-green-800 font-medium">
                {booking.phone}
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-green-600" />
              <a href={`mailto:${booking.email}`} className="text-green-700 hover:text-green-800 font-medium">
                {booking.email}
              </a>
            </div>
          </div>
        </div>
      );
    } else if (booking.bookingStatus === 'rejected') {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800 font-medium">
              Your booking request has been rejected.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderBasicInfo = (booking) => {
    if (booking.bookingStatus === 'accepted') {
      return (
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-sm">Booked on {formatBookedAt(booking.createdAt)}</span>
            </div>
          </div>
          {/* Show contact details for accepted bookings */}
          {activeTab === 'received' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-green-800 font-medium">
                  Booking accepted! Customer contact details:
                </p>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  <a href={`tel:${booking.phone}`} className="text-green-700 hover:text-green-800 font-medium">
                    {booking.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-green-600" />
                  <a href={`mailto:${booking.email}`} className="text-green-700 hover:text-green-800 font-medium">
                    {booking.email}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (booking.bookingStatus === 'rejected') {
      return (
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-sm">{formatDate(booking.createdAt)}</span>
          </div>
        </div>
      );
    } else {
      // For pending status
      if (activeTab === 'received') {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-sm">{formatDate(booking.createdAt)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-sm">{booking.location}</span>
            </div>
          </div>
        );
      } else {
        // For made bookings, don't show contact details when pending
        return (
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-sm">{formatDate(booking.createdAt)}</span>
            </div>
          </div>
        );
      }
    }
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-600 mt-1">Manage all your bookings in one place</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'received'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Store className="h-4 w-4" />
                Bookings Received
                <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {getTabCount('received')}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('made')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'made'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                My Bookings
                <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {getTabCount('made')}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by service name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Description */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {activeTab === 'received' ? (
                <Store className="h-5 w-5 text-blue-400" />
              ) : (
                <UserCheck className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {activeTab === 'received' 
                  ? "Bookings received from customers for your services. You can accept, reject, or cancel these bookings."
                  : "Services you've booked from other providers. You can track status and cancel pending bookings."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {activeTab === 'received' 
                    ? "No bookings received yet" 
                    : "No bookings made yet"
                  }
                </p>
              </div>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg mr-4 ${
                          activeTab === 'received' 
                            ? 'bg-green-100' 
                            : 'bg-blue-100'
                        }`}>
                          {activeTab === 'received' ? (
                            <User className="h-6 w-6 text-green-600" />
                          ) : (
                            <Building className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.serviceName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Booking ID: {booking.id}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {activeTab === 'received' && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Received
                                </span>
                              )}
                              {activeTab === 'made' && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  My Booking
                                </span>
                              )}
                              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.bookingStatus)}`}>
                                {getStatusIcon(booking.bookingStatus)}
                                {(booking.bookingStatus || 'unknown').toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Details Section - Only for "made" bookings */}
                      {activeTab === 'made' && renderContactDetails(booking)}

                      {/* Basic Info */}
                      {renderBasicInfo(booking)}

                      {booking.description && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {booking.description}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Booked on {formatBookedAt(booking.createdAt)}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                          
                          {/* Actions for received bookings (service provider) */}
                          {activeTab === 'received' && booking.bookingStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatus(booking.id, 'accepted')}
                                disabled={processingId === booking.id}
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                {processingId === booking.id ? 'Processing...' : 'Accept'}
                              </button>
                              <button
                                onClick={() => handleStatus(booking.id, 'rejected')}
                                disabled={processingId === booking.id}
                                className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                              >
                                <X className="h-4 w-4 mr-1" />
                                {processingId === booking.id ? 'Processing...' : 'Reject'}
                              </button>
                            </>
                          )}
                          
                          {/* Actions for received bookings (cancel accepted) */}
                          {activeTab === 'received' && booking.bookingStatus === 'accepted' && (
                            <button
                              onClick={() => handleStatus(booking.id, 'cancelled')}
                              disabled={processingId === booking.id}
                              className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              {processingId === booking.id ? 'Processing...' : 'Cancel'}
                            </button>
                          )}
                          
                          {/* Actions for made bookings (customer) */}
                          {activeTab === 'made' && booking.bookingStatus === 'pending' && (
                            <button
                              onClick={() => handleStatus(booking.id, 'cancelled')}
                              disabled={processingId === booking.id}
                              className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              {processingId === booking.id ? 'Processing...' : 'Cancel Booking'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
              >
                &times;
              </button>
              
              <div className="flex items-center mb-4">
                {activeTab === 'received' ? (
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">Booking Details</h2>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'received' ? 'Booking Received' : 'My Booking'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking ID
                  </label>
                  <p className="text-gray-900">#{selectedBooking.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <p className="text-gray-900">{selectedBooking.serviceName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                </div>
                
                {/* Contact Info - Show based on status and tab */}
                {((activeTab === 'received' && selectedBooking.bookingStatus === 'accepted') || 
                  (activeTab === 'made' && selectedBooking.bookingStatus === 'accepted')) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                    {activeTab === 'made' && selectedBooking.bookingStatus === 'accepted' && (
                      <div className="bg-green-50 p-3 rounded-lg mb-2">
                        <p className="text-green-800 text-sm font-medium mb-2">
                          Your request has been accepted! Contact details:
                        </p>
                      </div>
                    )}
                    {activeTab === 'received' && selectedBooking.bookingStatus === 'accepted' && (
                      <div className="bg-green-50 p-3 rounded-lg mb-2">
                        <p className="text-green-800 text-sm font-medium mb-2">
                          Booking accepted! Customer contact details:
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedBooking.phone}
                      </p>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedBooking.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Location - Show for received bookings when pending */}
                {activeTab === 'received' && selectedBooking.bookingStatus === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Location</label>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedBooking.location}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.bookingStatus)}`}>
                    {getStatusIcon(selectedBooking.bookingStatus)}
                    <span className="ml-1">{(selectedBooking.bookingStatus || 'unknown').toUpperCase()}</span>
                  </div>
                </div>
                
                {selectedBooking.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.description}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booked At</label>
                  <p className="text-gray-900">{formatBookedAt(selectedBooking.createdAt)}</p>
                </div>

                {/* Status-specific messages in modal */}
                {activeTab === 'made' && selectedBooking.bookingStatus === 'rejected' && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-red-800 font-medium">
                        Your booking request has been rejected.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default UnifiedBookingManagement;