import { useState } from "react";

const CategoriesSection = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: "restaurants",
      name: "Restaurants",
      icon: "🍽️",
      description: "Find the best dining spots",
      color: "from-orange-400 to-red-400",
    },
    {
      id: "hotels",
      name: "Hotels",
      icon: "🏨",
      description: "Book comfortable stays",
      color: "from-blue-400 to-indigo-400",
    },
    {
      id: "doctors",
      name: "Doctors",
      icon: "👨‍⚕️",
      description: "Healthcare professionals",
      color: "from-green-400 to-emerald-400",
    },
    {
      id: "travel",
      name: "Travel",
      icon: "✈️",
      description: "Plan your next adventure",
      color: "from-sky-400 to-blue-400",
    },
    {
      id: "auto-services",
      name: "Auto Services",
      icon: "🚗",
      description: "Car repair and maintenance",
      color: "from-gray-400 to-slate-400",
    },
    {
      id: "home-services",
      name: "Home Services",
      icon: "🔧",
      description: "Fix and maintain your home",
      color: "from-yellow-400 to-orange-400",
    },
    {
      id: "education",
      name: "Education",
      icon: "🎓",
      description: "Learning and tutoring",
      color: "from-purple-400 to-pink-400",
    },
  ];

  const handleCategoryClick = (categoryId) => {
    console.log(`Navigating to ${categoryId} category`);
    // Add your navigation logic here
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-blue-600 mb-3 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Explore Services
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Browse Categories
          </h2>
          <p className="text-gray-600 text-sm max-w-lg mx-auto">
            Discover local businesses and services in your area
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-gray-200 focus:outline-none focus:ring-3 focus:ring-blue-200 focus:scale-105 relative overflow-hidden"
              aria-label={`Browse ${category.name} - ${category.description}`}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              {/* Icon container */}
              <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white transition-colors duration-300 mb-2 border border-gray-100 group-hover:border-gray-200">
                <span
                  className="text-xl transition-transform duration-300 group-hover:scale-110"
                  role="img"
                  aria-label={category.name}
                >
                  {category.icon}
                </span>
              </div>

              {/* Category name */}
              <span className="text-xs md:text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors duration-300 relative z-10">
                {category.name}
              </span>

              {/* Description tooltip */}
              {hoveredCategory === category.id && (
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  {category.description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}

              {/* Hover indicator */}
              <div
                className={`w-0 h-0.5 bg-gradient-to-r ${category.color} group-hover:w-6 transition-all duration-300 mt-1.5 rounded-full relative z-10`}
              ></div>
            </button>
          ))}
        </div>

        {/* Bottom section */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-3"></p>
          <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:gap-3">
            <span className="text-sm transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
