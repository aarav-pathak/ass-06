import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/attendanceApi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  const load_stats = () => {
    setLoading(true);
    getDashboardStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getDashboardStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading attendance dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-container">
        <p>No statistics available.</p>
      </div>
    );
  }

  let today_pct_text = "No sessions yet";
  let today_badge = null;
  if (stats.todaySessions > 0) {
    today_pct_text = stats.todayPercentage + "%";
    if (stats.todayPercentage >= 75) {
      today_badge = <span className="badge badge-success">Target Met</span>;
    } else {
      today_badge = <span className="badge badge-danger">Below Target</span>;
    }
  }

  let subject_table_content;
  if (stats.subjectStats.length === 0) {
    subject_table_content = (
      <div className="state-card empty-state">
        <p>No subjects added yet.</p>
        <Link to="/admin/subjects/new" className="btn btn-primary">
          Add Subject
        </Link>
      </div>
    );
  } else {
    subject_table_content = (
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Semester</th>
              <th>Faculty</th>
              <th>Classes Held</th>
              <th>Average Attendance</th>
              <th>Shortage Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stats.subjectStats.map((sub) => {
              let badge_class = "badge-danger";
              let bar_class = "bg-danger";
              if (sub.avgPercentage >= 75) {
                badge_class = "badge-success";
                bar_class = "bg-success";
              }

              let shortage_badge = (
                <span className="badge badge-neutral">0 students</span>
              );
              if (sub.shortageCount > 0) {
                shortage_badge = (
                  <span className="badge badge-danger">
                    {sub.shortageCount} students
                  </span>
                );
              }

              let bar_width = sub.avgPercentage;
              if (bar_width > 100) {
                bar_width = 100;
              }

              return (
                <tr key={sub.id}>
                  <td>
                    <span className="code-pill">{sub.code}</span>
                  </td>
                  <td>
                    <strong>{sub.name}</strong>
                  </td>
                  <td>Sem {sub.semester}</td>
                  <td>{sub.teacherName}</td>
                  <td>{sub.totalClasses}</td>
                  <td>
                    <div className="progress-cell">
                      <span className={"badge " + badge_class}>
                        {sub.avgPercentage}%
                      </span>
                      <div className="progress-bar-bg">
                        <div
                          className={"progress-bar-fill " + bar_class}
                          style={{ width: bar_width + "%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{shortage_badge}</td>
                  <td>
                    <Link
                      to={"/admin/attendance/mark?subjectId=" + sub.id}
                      className="btn btn-sm btn-outline"
                    >
                      Mark Today
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Attendance Dashboard</h1>
          <p className="page-subtitle">Daily attendance and subject analytics</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/attendance/mark" className="btn btn-primary">
            Mark Attendance
          </Link>
          <button
            type="button"
            onClick={load_stats}
            className="btn btn-secondary"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card highlight-card">
          <div className="metric-content">
            <span className="metric-label">Today Overall Attendance</span>
            <div className="metric-value-row">
              <span className="metric-value">{today_pct_text}</span>
              {today_badge}
            </div>
            <span className="metric-meta">
              Date: {stats.todayDate} ({stats.todaySessions} sessions)
            </span>
          </div>
        </div>

        <div className="metric-card warning-card">
          <div className="metric-content">
            <span className="metric-label">Students in Shortage</span>
            <span className="metric-value text-danger">
              {stats.shortageStudentCount}
            </span>
            <span className="metric-meta">
              <Link to="/admin/shortage" className="link-underlined">
                View shortage list
              </Link>
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Enrolled Students</span>
            <span className="metric-value">{stats.totalStudents}</span>
            <span className="metric-meta">Active student accounts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Total Subjects</span>
            <span className="metric-value">{stats.totalSubjects}</span>
            <span className="metric-meta">
              {stats.totalAttendanceSessions} sessions held
            </span>
          </div>
        </div>
      </div>

      <div className="section-block">
        <div className="section-heading-row">
          <div>
            <h2>Subject-Wise Attendance Summary</h2>
            <p>Average attendance and shortage count by subject</p>
          </div>
          <Link to="/admin/subjects" className="btn btn-sm btn-secondary">
            Manage Subjects
          </Link>
        </div>
        {subject_table_content}
      </div>
    </div>
  );
}
