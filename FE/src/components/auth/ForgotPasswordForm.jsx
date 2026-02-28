import { useState } from "react";
import axios from "../auth/axios";

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("user/forgot-password", null, {
        params: { email },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Reset your password
      </h3>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
      />

      <button
        disabled={loading}
        className="w-full bg-red-500 text-white py-3 rounded-lg"
      >
        Send reset link
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-600"
      >
        Back to login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
