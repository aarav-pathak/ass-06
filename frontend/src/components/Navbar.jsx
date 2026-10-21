import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  let links;

  if (user) {
    let role_links;
    if (user.role === "Admin") {
      role_links = (
        <>
          <NavLink to="/admin/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/admin/attendance/mark" className="nav-link">
            Mark Attendance
          </NavLink>
          <NavLink to="/admin/subjects" className="nav-link">
            Subjects
          </NavLink>
          <NavLink to="/admin/shortage" className="nav-link">
            Shortage
          </NavLink>
        </>
      );
    } else {
      role_links = (
        <NavLink to="/my-attendance" className="nav-link">
          My Attendance
        </NavLink>
      );
    }

    let user_info = user.role;
    if (user.rollNumber) {
      user_info = user_info + " - " + user.rollNumber;
    }

    links = (
      <>
        <div className="nav-menu-group">{role_links}</div>
        <div className="user-profile">
          <div className="user-avatar-badge">
            <span className="avatar-dot"></span>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role-badge">{user_info}</span>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </>
    );
  } else {
    links = (
      <div className="auth-nav-links">
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>
        <NavLink to="/register" className="nav-link btn-register-link">
          Register
        </NavLink>
      </div>
    );
  }

  return (
    <header className="macbook-navbar-wrapper">
      <nav className="macbook-navbar">
        <div className="mac-window-controls">
          <span className="mac-dot mac-dot-close"></span>
          <span className="mac-dot mac-dot-minimize"></span>
          <span className="mac-dot mac-dot-zoom"></span>
        </div>

        <NavLink to="/" className="nav-brand">
          <span className="brand-dot"></span>
          <span className="brand-name">EduTrack</span>
          <span className="brand-tag">v1.0</span>
        </NavLink>

        <div className="nav-links">{links}</div>
      </nav>
    </header>
  );
}
