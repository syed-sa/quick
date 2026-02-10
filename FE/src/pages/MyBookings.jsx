import React, { useEffect, useState } from "react";
import {
  Calendar, Building, Eye, Search, Filter, ChevronDown,
  AlertCircle, CheckCircle, XCircle, Phone, Mail, X
} from "lucide-react";
import api from "../components/auth/axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    api.get(`bookservice/GetMyBookings/${userId}`)
      .then(res => {
        setBookings(res.data || []);
        setFilteredBookings(res.data || []);
      });
  }, []);

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

  const handleCancel = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      await api.post(`bookservice/UpdateBookingStatus/${bookingId}?status=cancelled`);
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, bookingStatus: "cancelled" } : b
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-gray-600">Services you have booked</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border mb-6 p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg appearance-none"
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

        {/* Booking List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white border rounded-lg py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No bookings found</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                      <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.bookingStatus)}`}>
                    {getStatusIcon(booking.bookingStatus)}
                    {booking.bookingStatus?.toUpperCase()}
                  </div>
                </div>

                {booking.description && (
                  <div className="bg-gray-50 p-3 rounded-lg mt-4 text-sm">
                    <strong>Notes:</strong> {booking.description}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center gap-1 text-sm border px-3 py-1 rounded-md"
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </button>

                  {booking.bookingStatus === "pending" && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={processingId === booking.id}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full relative">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-3 right-4 text-xl"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-2">Booking Details</h2>
              <p className="text-sm text-gray-600 mb-4">{selectedBooking.serviceName}</p>

              {selectedBooking.bookingStatus === "accepted" && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Phone className="h-4 w-4" /> {selectedBooking.phone}
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <Mail className="h-4 w-4" /> {selectedBooking.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;
