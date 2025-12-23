// src/components/BookingCard.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../auth/axios';

const BookingCard = ({ customerId, serviceId, serviceName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
const [state, setState] = useState('');

  const handleSubmit = async () => {
    if (!city || !state) {
      toast.error('Please select all fields.');
      return;
    }
    setLoading(true);
    try {
      const bookingDetails = { customerId, serviceId, serviceName, location : city + ',' + state, description };
      console.log("Booking payload", JSON.stringify(bookingDetails));
     const res = await api.post('bookservice/RequestBooking', bookingDetails);
      if (res.status === 200 || res.status === 201) {
        toast.success('Booking successful!');
        onClose();
      } else toast.error('Booking failed.');
    } catch (e) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-4">Request Service</h2>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Submit Booking'}
      </button>
    </div>
  </div>
);

};

export default BookingCard;
