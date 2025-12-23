import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
         .required("Password is required")
         .min(6, "Password must be at least 6 characters")
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "Something went wrong");

      if (resData.accessToken) {
        login(resData.accessToken,resData.refreshToken,resData.userName,resData.userId,resData.role);
      }

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-red-400"
          }`}
          placeholder="example@mail.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-red-400"
          }`}
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
      >
        Login
      </button>
    </form>
  );
};

export default SignInForm;
