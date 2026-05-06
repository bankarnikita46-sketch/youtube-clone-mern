import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", avatar: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (form.username.length < 3) e.username = "At least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-ytgray p-8 rounded-2xl w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        {["username", "email", "password"].map((f) => (
          <div key={f}>
            <input
              type={f === "password" ? "password" : f === "email" ? "email" : "text"}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              className="w-full bg-ytdark border border-ythover rounded-lg px-4 py-2.5"
            />
            {errors[f] && <p className="text-red-500 text-xs mt-1">{errors[f]}</p>}
          </div>
        ))}
        <input
          type="url"
          placeholder="Avatar URL (optional)"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          className="w-full bg-ytdark border border-ythover rounded-lg px-4 py-2.5"
        />
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
