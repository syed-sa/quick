import { MapPin } from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import axios from "../auth/axios";

const SearchSection = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  // ✅ Debounced value
  const debouncedCategory = useDebounce(category, 500);

  const handleLocationSelect = ({ postalCode, area }) => {
    setSelectedLocation({ postalCode, area });
  };

  // ✅ Moved fetch logic inside useEffect
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedCategory.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await axios.get(
          `/services/suggestions?q=${debouncedCategory}`,
        );

        setSuggestions(res.data); // 👈 axios uses .data
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion fetch error", err);
      }
    };

    fetchSuggestions();
  }, [debouncedCategory]);

  const handleSearch = () => {
    if (!selectedLocation || !category.trim()) {
      toast.error("Please select a location and enter a service");
      return;
    }

    navigate(
      `/services?keyWord=${category}&postalCode=${selectedLocation.postalCode}&area=${selectedLocation.area}`,
    );
  };

  return (
    <section className="bg-gradient-to-r from-yellow-400 to-red-500 py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Find the Best Services & Businesses Near You
        </h1>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg">
            {/* Location */}
            <div className="flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <LocationAutocomplete onSelect={handleLocationSelect} />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  value={category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategory(value); // ✅ no direct API call
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                />
              </div>

              {/* Suggestions — EXACTLY YOUR OLD STYLE */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-40 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                  <ul className="max-h-64 overflow-y-auto divide-y">
                    {suggestions.map((s, i) => {
                      const matchIndex = s
                        .toLowerCase()
                        .indexOf(category.toLowerCase());

                      return (
                        <li
                          key={i}
                          onMouseDown={() => {
                            setCategory(s);
                            setShowSuggestions(false);
                            setSuggestions([]);
                          }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 transition group"
                        >
                          <span className="text-sm text-gray-700 group-hover:text-red-600">
                            {matchIndex !== -1 ? (
                              <>
                                {s.substring(0, matchIndex)}
                                <span className="font-semibold text-red-500">
                                  {s.substring(
                                    matchIndex,
                                    matchIndex + category.length,
                                  )}
                                </span>
                                {s.substring(matchIndex + category.length)}
                              </>
                            ) : (
                              s
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Search Button */}
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

export default SearchSection;
