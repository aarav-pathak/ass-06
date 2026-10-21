import { Link } from "react-router-dom";

export default function NotFoundPage({ user }) {
  let home = "/login";
  if (user) {
    if (user.role === "Admin") {
      home = "/admin/dashboard";
    } else {
      home = "/my-attendance";
    }
  }

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to={home} className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
