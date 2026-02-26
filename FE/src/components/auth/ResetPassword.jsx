import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:8080/api/user/reset-password?token=${token}&newPassword=${password}`,
      { method: "POST" }
    );

    alert("Password reset successful");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-xl space-y-4">
        <h2 className="text-xl font-bold">Set new password</h2>

        <input
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button className="w-full bg-red-500 text-white py-3 rounded-lg">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
