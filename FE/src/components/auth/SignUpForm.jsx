import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/[0-9]/, "Must contain a number")
      .matches(/[@$!%*?&]/, "Must contain a special character"),
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
      const response = await fetch("http://localhost:8080/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "Something went wrong");

      alert("Account created successfully! Please login.");

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name")}
          className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-red-400"
          }`}
          placeholder="Your Name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

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
<div>
  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
  <div className="flex">
    {/* Country Code Selector */}
   <select
  {...register("countryCode")}
  className="w-20 px-2 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-700 text-sm"
>
  <option value="+91">🇮🇳 +91</option>
  <option value="+1">🇺🇸 +1</option>
  <option value="+44">🇬🇧 +44</option>
  <option value="+971">🇦🇪 +971</option>
  <option value="+61">🇦🇺 +61</option>
</select>
    {/* Phone Number Input */}
    <input
      type="tel"
      {...register("phone")}
      placeholder="Your Phone Number"
      className={`flex-grow px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 ${
        errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-red-400"
      }`}
    />
  </div>
  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
</div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
