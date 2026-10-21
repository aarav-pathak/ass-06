import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const on_change = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setErr("");
  };

  const on_submit = (event) => {
    if (event) {
      event.preventDefault();
    }
    setErr("");
    setLoading(true);

    login(form)
      .then((res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }

        let target = "/my-attendance";
        if (res.user.role === "Admin") {
          target = "/admin/dashboard";
        }
        navigate(target, { replace: true });
      })
      .catch((error) => {
        setErr(error.message);
        setLoading(false);
      });
  };

  const fill_login = (email, password) => {
    setForm({ email, password });
    setErr("");
  };

  let error_box = null;
  if (err) {
    error_box = <div className="alert alert-error">{err}</div>;
  }

  let btn_text = "Sign In";
  if (loading) {
    btn_text = "Signing in...";
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Class Attendance Management System</p>
        </div>

        {error_box}

        <form onSubmit={on_submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={on_change}
              placeholder="e.g. admin@college.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={on_change}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {btn_text}
          </button>
        </form>

        <div className="demo-accounts-box">
          <p className="demo-title">Quick Test Logins:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo"
              onClick={() => fill_login("admin@college.edu", "admin123")}
            >
              Teacher / Admin
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => fill_login("aarav@college.edu", "student123")}
            >
              Student (Above 75%)
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => fill_login("diya@college.edu", "student123")}
            >
              Student (Below 75%)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
