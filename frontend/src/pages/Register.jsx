import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-[#f8f5ef] px-6 py-14">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-center text-3xl font-bold">
          Create Account
        </h1>

        <p className="mb-8 mt-2 text-center text-gray-500">
          Join StyleHub and discover your style.
        </p>

        {[
          ["name", "Full Name", "text"],
          ["email", "Email Address", "email"],
          ["password", "Password", "password"],
        ].map(([name, label, type]) => (
          <label key={name} className="mb-5 block">
            <span className="mb-2 block text-sm font-medium">
              {label}
            </span>

            <input
              type={type}
              required
              minLength={name === "password" ? 6 : undefined}
              value={form[name]}
              onChange={(e) =>
                setForm({ ...form, [name]: e.target.value })
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-600"
            />
          </label>
        ))}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          disabled={loading}
          className="mt-5 w-full rounded-full bg-emerald-700 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-emerald-700">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;