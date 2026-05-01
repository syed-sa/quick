// src/components/auth/CheckEmail.js
import { Link } from "react-router-dom";
import { MdMarkEmailRead } from "react-icons/md";

const CheckEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <MdMarkEmailRead className="h-20 w-20 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">
          Verify Your Email
        </h2>
        
        <p className="text-gray-600">
          Thank you for signing up! We've sent a verification link to your email address.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            Please check your inbox and click the verification link to activate your account.
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/auth"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Go to Login
          </Link>
          
          <button
            onClick={() => window.location.href = "https://mail.google.com"}
            className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
          >
            Open Gmail
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;