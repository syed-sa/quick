// components/sections/SearchSection.jsx
import { MapPin } from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import axios from "../auth/axios";
import { useAuth } from "../../context/AuthContext";

const SearchSection = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const sectionRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  const debouncedCategory = useDebounce(category, 500);

  const handleLocationSelect = ({ postalCode, area }) => {
    setSelectedLocation({ postalCode, area });
  };

  const handleSearch = () => {
    if (!selectedLocation || !category.trim()) {
      toast.error("Please select a location and enter a service");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      // Save search params to redirect back after login
      navigate("/auth", {
        state: {
          from: `/services?keyWord=${encodeURIComponent(category)}&postalCode=${selectedLocation.postalCode}&area=${selectedLocation.area}`,
          message: "Please sign in to search for services"
        }
      });
      return;
    }

    // If authenticated, proceed with search
    navigate(
      `/services?keyWord=${category}&postalCode=${selectedLocation.postalCode}&area=${selectedLocation.area}`,
    );
  };

  // Rest of your existing useEffect and handler code remains exactly the same...
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (showSuggestions) {
        setShowSuggestions(false);
        setIsInputFocused(false);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showSuggestions]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowSuggestions(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const checkInViewport = () => {
      if (showSuggestions && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const isInViewport = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (!isInViewport) {
          setShowSuggestions(false);
          setIsInputFocused(false);
        }
      }
    };

    window.addEventListener("scroll", checkInViewport);
    window.addEventListener("resize", checkInViewport);
    
    return () => {
      window.removeEventListener("scroll", checkInViewport);
      window.removeEventListener("resize", checkInViewport);
    };
  }, [showSuggestions]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedCategory.trim().length < 3 || !isInputFocused) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await axios.get(
          `/services/suggestions?q=${debouncedCategory}`,
        );

        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion fetch error", err);
      }
    };

    fetchSuggestions();
  }, [debouncedCategory, isInputFocused]);

  const handleSuggestionSelect = (suggestion) => {
    setCategory(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsInputFocused(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    if (category.trim().length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    
    blurTimeoutRef.current = setTimeout(() => {
      if (suggestionsRef.current && !suggestionsRef.current.matches(':hover')) {
        setShowSuggestions(false);
      }
      blurTimeoutRef.current = null;
    }, 150);
  };

  const handleSuggestionsMouseEnter = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const handleSuggestionsMouseLeave = () => {
    if (!isInputFocused) {
      blurTimeoutRef.current = setTimeout(() => {
        setShowSuggestions(false);
        blurTimeoutRef.current = null;
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-gradient-to-r from-yellow-400 to-red-500 py-12 md:py-20"
    >
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
                  ref={inputRef}
                  type="text"
                  placeholder="Search for services..."
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  value={category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategory(value);
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-40 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
                  onMouseEnter={handleSuggestionsMouseEnter}
                  onMouseLeave={handleSuggestionsMouseLeave}
                >
                  <ul className="max-h-64 overflow-y-auto divide-y">
                    {suggestions.map((s, i) => {
                      const matchIndex = s
                        .toLowerCase()
                        .indexOf(category.toLowerCase());

                      return (
                        <li
                          key={i}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionSelect(s);
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
              className="bg-red-500 text-white px-6 py-3 font-medium hover:bg-red-600 transition duration-200 rounded-r-lg"
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