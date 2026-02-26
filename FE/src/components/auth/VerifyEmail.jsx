import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../auth/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    api.post(`/user/verify-email?token=${token}`)
      .then(() => {
        alert("Email verified successfully! You can now log in.");
        navigate("/auth");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Email verification failed.");
        navigate("/auth");
      });
  }, [token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;
