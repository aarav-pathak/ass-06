import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    let fallback = "/my-attendance";
    if (user.role === "Admin") {
      fallback = "/admin/dashboard";
    }
    return <Navigate to={fallback} replace />;
  }

  return children;
}
