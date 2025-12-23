import { MapPin } from "lucide-react";
import LocationAutocomplete from "../sections/LocationAutocomplete"; // Import the component
import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ This is correct

const HeroSection = ({ selectedCity }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleLocationSelect = ({ postalCode, area }) => {
    console.log("Selected Postal Code:", postalCode);
    console.log("Selected Area:", area);
    setSelectedLocation({ postalCode, area });
    // Optionally, you can auto-search or pass this to parent component
  };

  const handleSearch = async () => {
    if (selectedLocation && category.trim()) {
        const searchParams = new URLSearchParams({
            category: category,
            postalCode: selectedLocation.postalCode,
            area: selectedLocation.area
          });
          navigate(`/services?${searchParams.toString()}`);
    } else {
      toast.error("Please select a location and enter a category.");
    }
  };

  return (
    <section className="bg-gradient-to-r from-yellow-400 to-red-500 py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Find the Best Services & Businesses Near You
        </h1>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg">
            <div className="flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <LocationAutocomplete onSelect={handleLocationSelect} />
            </div>

            <div className="flex-1 relative">
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3">
                <input
                  type="text"
                  placeholder="Search for services, restaurants, shops..."
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </div>
            </div>

            <button
              className="bg-red-500 text-white px-6 py-3 font-medium hover:bg-red-600 transition duration-200"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
