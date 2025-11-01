import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css"; // add styles below

export default function LoginSignup() {
  // “Login” | “Sign Up”
  const [mode, setMode] = useState("Login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "Login") {
        await login(form.email || form.username, form.password);
      } else {
        await register(form);
      }
      navigate("/blog");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2 className="auth-title">{mode}</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} autoComplete="off">
        {mode === "Sign Up" && (
          <div className="mb-3">
            <label>Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {mode === "Sign Up" && (
          <div className="mb-3">
            <label>Username</label>
            <input
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {mode === "Sign Up" && (
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {mode === "Login" && (
          <div className="mb-3">
            <label>Email or Username</label>
            <input
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {mode === "Login" && (
          <div className="text-end mb-3">
            <a href="#" className="small text-primary text-decoration-none">
              Forgot password?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (mode === "Login" ? "Logging in…" : "Signing up…") : mode}
        </button>
      </form>

      <p className="text-center mt-3 mb-0 toggle-link">
        {mode === "Login" ? (
          <>
            Don’t have an account?{" "}
            <span
              className="link-primary"
              role="button"
              onClick={() => setMode("Sign Up")}
            >
              Sign Up →
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="link-primary"
              role="button"
              onClick={() => setMode("Login")}
            >
              Login →
            </span>
          </>
        )}
      </p>
    </div>
  );
}