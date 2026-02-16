import api from "../components/auth/axios";
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  ImagePlus,
  Tag,
  X,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import useDebounce from "../hooks/useDebounce";

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

  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedCategory = useDebounce(categoryInput, 500);
  const abortControllerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch category suggestions
  useEffect(() => {
    if (debouncedCategory.trim().length < 2) {
      setCategorySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchSuggestions = async () => {
      try {
        const res = await api.get(
          `services/category/suggestions?q=${debouncedCategory}`,
          {
            signal: controller.signal,
          },
        );

        setCategorySuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Category suggestion error", err);
          toast.error("Failed to fetch categories");
        }
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [debouncedCategory]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Validate file types
    const validFiles = newFiles.filter((file) => {
      const isValid = file.type.startsWith("image/");
      if (!isValid) {
        toast.warning(`${file.name} is not a valid image file`);
      }
      return isValid;
    });

    setFormData((prev) => {
      const combined = [...prev.images, ...validFiles];
      const limited = combined.slice(0, 5);

      if (combined.length > 5) {
        toast.info("Maximum 5 images allowed");
      }

      return { ...prev, images: limited };
    });

    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    toast.info("Image removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Please select a business category from suggestions");
      return;
    }

    if (formData.images.length === 0) {
      toast.warning("Please upload at least one business image");
      return;
    }

    setIsSubmitting(true);

    const form = new FormData();
    form.append("userId", localStorage.getItem("userId"));
    form.append("companyName", formData.businessName);
    form.append("city", formData.city);
    form.append("businessCategoryId", selectedCategory.id);
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("address", formData.address);
    form.append("postalCode", formData.postalCode);

    formData.images.forEach((file) => {
      form.append("images", file);
    });

    try {
      await api.post("/services/register", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Business registered successfully!");

      setFormData({
        businessName: "",
        category: "",
        phone: "",
        email: "",
        address: "",
        postalCode: "",
        city: "Chennai",
        images: [],
      });

      setCategoryInput("");
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(
        err.response?.data || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              List Your Business
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful businesses. Get discovered by
              customers actively searching for your services.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4">
            <h2 className="text-xl font-semibold text-white">
              Business Information
            </h2>
          </div>

          <div className="p-8 space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="businessName"
                  placeholder="Enter your company name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
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
                </select>
              </div>
            </div>

            {/* Category with Autocomplete */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Business Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  placeholder="Type to search category (e.g., Plumbing, Salon)"
                  value={categoryInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategoryInput(value);
                    setSelectedCategory(null);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
                {selectedCategory && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && categorySuggestions.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
                    {categorySuggestions.map((cat) => (
                      <li
                        key={cat.id}
                        onMouseDown={() => {
                          setCategoryInput(cat.name);
                          setSelectedCategory(cat);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">
                            {cat.name}
                          </span>
                          {selectedCategory?.id === cat.id && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {selectedCategory && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Category selected: {selectedCategory.name}</span>
                </div>
              )}
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Postal Code
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="560001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                placeholder="Enter complete business address with landmarks"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Business Images */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Business Images <span className="text-red-500">*</span>
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    <ImagePlus className="w-5 h-5 mr-2" />
                    Choose Images
                  </span>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-3">
                  Upload up to 5 images (JPG, PNG, GIF)
                </p>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-colors"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                        Image {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Before you submit:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Ensure all information is accurate</li>
                  <li>Upload clear, high-quality images</li>
                  <li>Double-check your contact details</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Business Listing</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Need help? Contact our support team at support@quick.com</p>
        </div>
      </div>
    </section>
  );
};

export default RegisterService;
