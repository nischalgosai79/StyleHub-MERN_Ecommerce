import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect");

  const [form, setForm] = useState({
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
      const user = await login(form);

      if (redirect) {
        navigate(redirect);
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed."
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
        <h1 className="text-center text-3xl font-bold">Welcome Back</h1>

        <p className="mb-8 mt-2 text-center text-gray-500">
          Login to your StyleHub account.
        </p>

        <label className="mb-5 block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-600"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-600"
          />
        </label>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        <button
          disabled={loading}
          className="mt-7 w-full rounded-full bg-emerald-700 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-emerald-700">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;