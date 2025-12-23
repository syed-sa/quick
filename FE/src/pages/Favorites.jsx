import React from "react";

const Favorites = () => {
  const favoriteServices = []; // Replace with actual data

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Favorite Services</h2>

      {favoriteServices.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't added any services to favorites yet.
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteServices.map((service, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.category}</p>
              </div>
              <button className="text-red-500 hover:underline text-sm">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
