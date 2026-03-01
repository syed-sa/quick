import { Smartphone, Star, Award, Clock, Zap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const AppDownloadSection = () => {
  const handleAppStoreClick = (e) => {
    e.preventDefault();
    alert("📱 Mobile app is coming soon! We're working hard to bring you an amazing app experience. Stay tuned!");
  };

  const handlePlayStoreClick = (e) => {
    e.preventDefault();
    alert("📱 Mobile app is coming soon! We're working hard to bring you an amazing app experience. Stay tuned!");
  };

  return (
    <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-3">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-orange-100 rounded-full">
              <Smartphone className="h-3 w-3 text-orange-600 mr-1" />
              <span className="text-xs font-semibold text-orange-600">Coming Soon</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900">
              Get the{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Quick
              </span>{' '}
              App
            </h2>
            
            <p className="text-sm text-gray-600 max-w-lg">
              Be the first to know when we launch! Our mobile app will make finding local services even faster.
            </p>

            {/* Features List - Compact */}
            <div className="grid grid-cols-2 gap-2 py-1">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-3 w-3 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Lightning Fast</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Star className="h-3 w-3 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Exclusive Deals</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-3 w-3 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">24/7 Support</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="h-3 w-3 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">Verified Pros</p>
              </div>
            </div>

            {/* Download Buttons - Smaller */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleAppStoreClick}
                className="group relative bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-900 transition-all duration-300 text-sm"
              >
                {/* Apple Icon */}
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-111.4-60.7-125.2zM249.8 84.7c23.8-28.9 21.3-54.7 20.6-55.7-22.6 1.5-50 15.5-66.1 34.9-14.7 17.6-26.1 43.4-22.4 68.4 24.4 1.9 48.6-13.7 67.9-37.6z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-80 leading-tight">Download on the</div>
                  <div className="font-semibold text-xs leading-tight">App Store</div>
                </div>
              </button>

              <button
                onClick={handlePlayStoreClick}
                className="group relative bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-900 transition-all duration-300 text-sm"
              >
                {/* Google Play Icon */}
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-80 leading-tight">Get it on</div>
                  <div className="font-semibold text-xs leading-tight">Google Play</div>
                </div>
           
              </button>
            </div>

            {/* Notification Signup - Now links to auth page */}
            <div className="flex items-center gap-2 pt-1">
              <p className="text-xs text-gray-500">
                🔔 Want to be notified?
              </p>
              <Link
                to="/auth"
                className="group relative px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap overflow-hidden shadow-md hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {/* Animated background effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {/* Button content */}
                <span className="relative flex items-center justify-center space-x-1">
                  <LogIn className="h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign Up</span>
                </span>
                
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></span>
              </Link>
            </div>
          </div>

          {/* Right Content - Smaller Image */}
          <div className="lg:w-1/2 flex justify-center relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-2xl -z-10"></div>
            
            {/* App Mockup Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Mobile App Interface" 
                className="h-56 object-contain rounded-2xl shadow-xl"
              />
              
              {/* Floating Badge 1 */}
              <div className="absolute -top-3 -left-3 bg-white px-2 py-1 rounded-full shadow-md animate-bounce">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-[10px] font-semibold">4.9</span>
                </div>
              </div>
              
              {/* Floating Badge 2 */}
              <div className="absolute -bottom-3 -right-3 bg-white px-2 py-1 rounded-full shadow-md animate-bounce delay-300">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-orange-500" />
                  <span className="text-[10px] font-semibold">Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;