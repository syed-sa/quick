import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-20 via-red-20 to-pink-20 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Image Section */}
        <div className="hidden md:block relative overflow-hidden">
          {/* Replace this URL with your chosen image from Unsplash */}
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
            alt="Local business"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/90 to-orange-600/90"></div>

          {/* Content overlay */}
          <div className="relative h-full flex flex-col justify-center items-center p-12 text-white">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-4xl font-bold text-red-500">Q</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Discover Local</h1>
              <p className="text-xl text-red-50 mb-8">
                Connect with businesses in Chennai
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Find local services & businesses
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Read & write reviews
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Grow your business
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">Q</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome to Quick
            </h2>
          </div>
          {!showForgot && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 hidden md:block">
                  {isLogin ? "Welcome Back!" : "Create Account"}
                </h2>
                <p className="text-gray-600 hidden md:block">
                  {isLogin
                    ? "Enter your credentials to access your account"
                    : "Sign up to start exploring local businesses"}
                </p>
              </div>

              <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
                <button
                  className={`flex-1 px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
                    isLogin
                      ? "bg-white text-red-500 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`flex-1 px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
                    !isLogin
                      ? "bg-white text-red-500 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {showForgot ? (
            <ForgotPasswordForm onBack={() => setShowForgot(false)} />
          ) : isLogin ? (
            <SignInForm onForgotPassword={() => setShowForgot(true)} />
          ) : (
            <SignUpForm />
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                className="text-red-500 font-semibold hover:text-red-600 transition-colors"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to Quick's Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
