import { useState } from "react";
import axios from "../auth/axios";

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("user/forgot-password", null, {
        params: { email },
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || 
        "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // If successfully submitted, show success message
  if (submitSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Check your email
          </h3>
          <p className="text-gray-600">
            We've sent a password reset link to <span className="font-medium text-gray-800">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Didn't receive it? Check your spam folder or try again.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(false);
              setEmail("");
            }}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all duration-200 hover:shadow-lg"
          >
            Try another email
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full text-sm text-gray-600 py-2 hover:text-gray-800 hover:underline transition-all duration-200"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Reset your password
        </h3>
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
          placeholder="Enter your email"
          disabled={loading}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-red-400 focus:outline-none 
            transition-all duration-200
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          <svg 
            className="w-5 h-5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className={`
          w-full bg-red-500 text-white py-3 rounded-lg font-medium
          transition-all duration-200 transform
          ${loading || !email 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-red-600 active:scale-95 hover:shadow-lg'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send reset link'
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className={`
          w-full text-sm text-gray-600 py-2
          transition-all duration-200
          ${loading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:text-gray-800 hover:underline'
          }
        `}
      >
        ← Back to login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;