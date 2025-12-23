import { useState } from "react";
import { Building2, Phone, Mail, Globe, MapPin, ImagePlus } from "lucide-react";

const RegisterService = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "Bangalore",
    images: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const form = new FormData();
  form.append("userId", localStorage.getItem("userId")); 
  form.append("companyName", formData.businessName);
  form.append("city", formData.city);
  form.append("businessCategory", formData.category);
  form.append("phone", formData.phone);
  form.append("email", formData.email);
  form.append("website", formData.website);
  form.append("address", formData.address);

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
      alert("Failed: " + error);
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

          <form onSubmit={handleSubmit} className="space-y-5 text-sm text-gray-700">
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

            {/* Category */}
            <div className="space-y-2">
              <label className="block font-medium">Business Category</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <Globe className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  name="category"
                  placeholder="e.g., Salon, Electrician"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none"
                  required
                />
              </div>
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

            {/* Website */}
            <div className="space-y-2">
              <label className="block font-medium">Website (optional)</label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <Globe className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="url"
                  name="website"
                  placeholder="https://yourbusiness.com"
                  value={formData.website}
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
                    <label className="block font-medium">Upload Business Images</label>
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
                      <div key={idx} className="relative overflow-hidden rounded-md border">
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
