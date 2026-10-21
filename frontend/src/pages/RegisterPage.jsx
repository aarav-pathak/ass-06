import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

export default function RegisterPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    semester: 3,
    section: "A",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const on_change = (event) => {
    const field = event.target.name;
    let val = event.target.value;
    if (field === "semester") {
      val = Number(val);
    }
    setForm({
      ...form,
      [field]: val,
    });
    setErr("");
  };

  const on_submit = (event) => {
    event.preventDefault();
    setErr("");
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: role,
    };

    if (role === "Student") {
      payload.rollNumber = form.rollNumber;
      payload.semester = form.semester;
      payload.section = form.section;
    }

    register(payload)
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

  let student_btn_class = "role-btn";
  if (role === "Student") {
    student_btn_class = "role-btn active";
  }

  let admin_btn_class = "role-btn";
  if (role === "Admin") {
    admin_btn_class = "role-btn active";
  }

  let submit_text = "Register as " + role;
  if (loading) {
    submit_text = "Creating Account...";
  }

  let error_box = null;
  if (err) {
    error_box = <div className="alert alert-error">{err}</div>;
  }

  let student_fields = null;
  if (role === "Student") {
    student_fields = (
      <div className="student-fields-box">
        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number *</label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            value={form.rollNumber}
            onChange={on_change}
            placeholder="e.g. CS2301"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <select
              id="semester"
              name="semester"
              value={form.semester}
              onChange={on_change}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Semester {num}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="section">Section *</label>
            <input
              id="section"
              name="section"
              type="text"
              value={form.section}
              onChange={on_change}
              placeholder="e.g. A"
              maxLength={2}
              style={{ textTransform: "uppercase" }}
              required
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Register as a Student or Teacher/Admin</p>
        </div>

        {error_box}

        <div className="role-switch">
          <button
            type="button"
            className={student_btn_class}
            onClick={() => setRole("Student")}
          >
            Student
          </button>
          <button
            type="button"
            className={admin_btn_class}
            onClick={() => setRole("Admin")}
          >
            Teacher / Admin
          </button>
        </div>

        <form onSubmit={on_submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={on_change}
              placeholder="e.g. Aarav Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={on_change}
              placeholder="e.g. aarav@college.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={on_change}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          {student_fields}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {submit_text}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
