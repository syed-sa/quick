import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import axios from "../auth/axios"; // 👈 use your axios instance

export default function LocationAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ✅ Debounced backend call
  const debouncedFetch = useMemo(
    () =>
      debounce(async (q) => {
        if (!q || q.trim().length < 3) {
          setSuggestions([]);
          return;
        }

        try {
          const res = await axios.get(
            `/location/search?q=${encodeURIComponent(q)}`
          );
          setSuggestions(res.data);
        } catch (err) {
          console.error("Location fetch error", err);
          setSuggestions([]);
        }
      }, 800),
    []
  );

  useEffect(() => {
    debouncedFetch(query);
    return () => {
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  const handleSelect = (place) => {
    const postalCode = place.postalCode || "";
    const area = place.displayName;

    onSelect({ postalCode, area });
    setSuggestions([]);
    setQuery(area);
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={query}
        placeholder="Enter pin code"
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none text-sm text-gray-700"
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((place, i) => (
            <li
              key={i}
              onClick={() => handleSelect(place)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-red-100 cursor-pointer transition-colors duration-150"
            >
              {place.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
