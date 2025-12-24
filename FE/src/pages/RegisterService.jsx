import { useState } from "react";
import api from  "../components/auth/axios";
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  ImagePlus,
  TagIcon,
} from "lucide-react";
import { toast } from "react-toastify";
const RegisterService = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    city: "Chennai",
    images: [],
  });

  // 🔹 Category states
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const accessToken = localStorage.getItem("token");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Fetch category suggestions
  const fetchCategorySuggestions = async (value) => {
    if (value.trim().length < 2) {
      setCategorySuggestions([]);
      return;
    }

    try {
      const res = await api.get(
        `services/category/suggestions?q=${value}`);
       setCategorySuggestions(res.data); // ✅ FIX
    setShowSuggestions(true);
    } catch (err) {
      console.error("Category suggestion error", err);
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => {
      const combined = [...prev.images, ...newFiles];

      // Optional: Limit to max 5 images
      const limited = combined.slice(0, 5);

      return { ...prev, images: limited };
    });

    // Reset file input value so selecting same file again will trigger onChange
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Please select a business category from suggestions");
      return;
    }

    const form = new FormData();
    form.append("userId", localStorage.getItem("userId"));
    form.append("companyName", formData.businessName);
    form.append("city", formData.city);
    form.append("businessCategoryId", selectedCategory.id);
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("address", formData.address);
    form.append("postalCode", formData.postalCode);

    // Append each image
    formData.images.forEach((file) => {
      form.append("images", file);
    });

    try {
      const res = await fetch("http://localhost:8080/api/services/register", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        alert("Business registered successfully!");
      } else {
        const error = await res.text();
        alert(error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong");
    }
  };

  return (
    <section className="bg-gradient-to-r from-yellow-50 to-red-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-yellow-100">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            List Your Business
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Promote your services and get discovered by thousands of customers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 text-sm text-gray-700"
          >
            {/* Business Name */}
            <div className="space-y-2">
              <label className="block font-medium">Company Name</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <Building2 className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  name="businessName"
                  placeholder="ABC Services"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block font-medium">City</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                >
                  <option>Bangalore</option>
                  <option>Chennai</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="font-medium">Business Category</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <TagIcon className="w-4 h-4 mr-2" />
                <input
                  placeholder="Type to search category"
                  value={categoryInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategoryInput(value);
                    setSelectedCategory(null); // 🔴 reset selection
                    fetchCategorySuggestions(value);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>

              {/* Suggestions */}
              {showSuggestions && categorySuggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
                  {categorySuggestions.map((cat) => (
                    <li
                      key={cat.id}
                      onMouseDown={() => {
                        setCategoryInput(cat.name);
                        setSelectedCategory(cat);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-yellow-50"
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}

              {selectedCategory && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Category selected
                </p>
              )}
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Phone</label>
                <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Email</label>
                <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* postalCode */}
            <div className="space-y-2">
              <label className="block font-medium">postalCode </label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <Globe className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="560001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block font-medium">Full Address</label>
              <textarea
                name="address"
                placeholder="Full business address with landmarks if any"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full border px-4 py-3 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              ></textarea>
            </div>
            {/* Business Images */}
            <div className="space-y-2">
              <label className="block font-medium">
                Upload Business Images
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer hover:bg-yellow-600 transition">
                  <ImagePlus className="w-4 h-4 mr-2" />
                  <span>Upload Images</span>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-500">
                  You can upload up to 5 images.
                </span>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-md border"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }));
                        }}
                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 hover:bg-red-100 z-10"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${idx}`}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Submit Business Listing
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterService;
