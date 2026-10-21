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
            Shortage List
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
        {role_links}
        <div className="user-profile">
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role-badge">{user_info}</span>
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
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          <span className="brand-name">EduTrack</span>
          <span className="brand-tag">Attendance Portal</span>
        </NavLink>
        <div className="nav-links">{links}</div>
      </div>
    </nav>
  );
}
