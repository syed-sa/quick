// components/auth/SignInForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "./axios";

const SignInForm = ({ onForgotPassword, onSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState(null);
  const [shake, setShake] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const onSubmit = async (data) => {
    setAuthError(null);

    try {
      const response = await api.post("user/signin", data);
      const resData = response.data;

      login(
        resData.accessToken,
        resData.refreshToken,
        resData.userName,
        resData.userId,
        resData.role,
      );

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (err) {
      triggerShake();
      setAuthError(
        err.response?.data?.message || "Incorrect email or password",
      );
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
            100% { transform: translateX(0); }
          }
          .shake {
            animation: shake 0.45s ease-in-out;
          }
        `}
      </style>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-4 ${shake ? "shake" : ""}`}
      >
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email || authError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-red-400"
            }`}
            placeholder="example@mail.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password || authError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-red-400"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Auth Error Message */}
        {authError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M10.29 3.86l-8.53 14.77A1.5 1.5 0 003.06 21h17.88a1.5 1.5 0 001.3-2.37L13.71 3.86a1.5 1.5 0 00-2.42 0z"
              />
            </svg>
            <span>{authError}</span>
          </div>
        )}

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default SignInForm;
