import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SubjectListPage from "./pages/SubjectListPage";
import SubjectNewPage from "./pages/SubjectNewPage";
import SubjectEditPage from "./pages/SubjectEditPage";
import AttendanceMarkPage from "./pages/AttendanceMarkPage";
import ShortageListPage from "./pages/ShortageListPage";
import StudentSummaryPage from "./pages/StudentSummaryPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";

function get_user() {
  const str = localStorage.getItem("user");
  if (!str) {
    return null;
  }
  return JSON.parse(str);
}

function get_home(user) {
  if (!user) {
    return "/login";
  }
  if (user.role === "Admin") {
    return "/admin/dashboard";
  }
  return "/my-attendance";
}

export default function App() {
  const [user, setUser] = useState(get_user);

  const on_login = (user_data) => {
    setUser(user_data);
  };

  const on_logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  let home_redirect = <Navigate to={get_home(user)} replace />;

  let login_element = <LoginPage onLoginSuccess={on_login} />;
  if (user) {
    login_element = home_redirect;
  }

  let register_element = <RegisterPage onLoginSuccess={on_login} />;
  if (user) {
    register_element = home_redirect;
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={on_logout} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={home_redirect} />
          <Route path="/login" element={login_element} />
          <Route path="/register" element={register_element} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <SubjectListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subjects/new"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <SubjectNewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subjects/:id/edit"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <SubjectEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/attendance/mark"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <AttendanceMarkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/shortage"
            element={
              <ProtectedRoute user={user} requiredRole="Admin">
                <ShortageListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-attendance"
            element={
              <ProtectedRoute user={user} requiredRole="Student">
                <StudentSummaryPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-attendance/:subjectId"
            element={
              <ProtectedRoute user={user} requiredRole="Student">
                <StudentDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage user={user} />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Class Attendance Management System</p>
      </footer>
    </div>
  );
}
