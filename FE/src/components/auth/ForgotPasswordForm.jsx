import { useState } from "react";

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(
        `http://localhost:8080/api/user/forgot-password?email=${email}`,
        { method: "POST" }
      );

      alert("If the email exists, a reset link has been sent");
      onBack();
    } catch {
      alert("Something went wrong");
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
