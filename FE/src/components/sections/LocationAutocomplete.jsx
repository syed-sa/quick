import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export default function LocationAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = debounce(async (q) => {
    if (!q) return setSuggestions([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q + ", Chennai"
      )}&format=json&limit=5&addressdetails=1`
    );
    const data = await res.json();
    setSuggestions(data);
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const handleSelect = (place) => {
    const postalCode = place.address?.postcode || "";
    const area = place.display_name;
    onSelect({ postalCode, area });
    setSuggestions([]);
    setQuery(area);
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={query}
        placeholder="Enter area in Chennai"
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-gray-300  focus:outline-none text-sm text-gray-700"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((place, i) => (
            <li
              key={i}
              onClick={() => handleSelect(place)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-red-100 cursor-pointer transition-colors duration-150"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
