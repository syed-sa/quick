import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  Mail,
  MapPin,
  User,
  Edit2,
  Save,
  X,
  Camera,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../components/auth/axios";
import { useEffect } from "react";

const ProfilePage = () => {
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "Chennai",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("user/myProfile");
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          city: res.data.city || "Chennai",
        });
        setProfile({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          city: res.data.city || "Chennai",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(formData.phone)) {
        toast.warning("Phone number must be 10 digits");
        return;
      }
      const res = await api.put("user/updateMyProfile", {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
      });
      if (res && res.status === 200) {
        setProfile(res.data);
        setFormData(res.data);
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error("Failed to update profile");
        console.error("Failed to update profile:", res.statusText);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setEditMode(false);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (formData.name) {
      return formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return formData.email.charAt(0).toUpperCase();
  };

  // Calculate member since date (mock data)
  const memberSince = "January 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                  {getInitials()}
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {formData.name || formData.email.split("@")[0]}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{formData.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Member since {memberSince}</span>
                  </div>
                </div>
                {user?.role === "ADMIN" && (
                  <div className="mt-3 inline-flex items-center space-x-1 px-3 py-1 bg-red-50 rounded-full">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">
                      Admin Account
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              Personal Information
            </h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                {editMode ? (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {formData.name || "Not set"}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {formData.email}
                  </span>
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {editMode ? (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {formData.phone || "Not set"}
                    </span>
                  </div>
                )}
              </div>

              {/* City */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                {editMode ? (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {formData.city}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {editMode && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Account Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg border border-orange-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Account Security
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Keep your account secure with these recommendations
              </p>
              <button className="w-full px-4 py-2.5 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
