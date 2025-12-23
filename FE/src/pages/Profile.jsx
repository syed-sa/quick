import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Mail, MapPin, User } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "", // You can prefill this from user object if available
    email: user?.email || "",
    city: "Bangalore",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Later you can call your backend API here
      // await axios.post("/api/user/update", formData);
      console.log("Saved data:", formData);

      setEditMode(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-red-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="bg-yellow-500 text-white rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold shadow-md">
              {formData.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {formData.name || formData.email.split("@")[0]}
              </h2>
              <p className="text-gray-500 text-sm">{formData.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-3" />
              {editMode ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-yellow-500 px-2 py-1"
                />
              ) : (
                <span className="text-gray-700 font-medium">
                  {formData.name || "N/A"}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700 font-medium">
                {formData.email}
              </span>
            </div>

            {/* City Field */}
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-3" />
              {editMode ? (
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border-b border-gray-300 focus:outline-none focus:border-yellow-500 px-2 py-1"
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              ) : (
                <span className="text-gray-700 font-medium">
                  {formData.city}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 text-right">
            {editMode ? (
              <div className="space-x-3">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
