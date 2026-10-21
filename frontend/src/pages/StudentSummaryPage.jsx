import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentSummary } from "../api/attendanceApi";

export default function StudentSummaryPage({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load_data = () => {
    setLoading(true);
    getStudentSummary().then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getStudentSummary().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading attendance records...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-container">
        <p>No attendance data found.</p>
      </div>
    );
  }

  let user_name = user?.name || "Student";
  if (data.student && data.student.name) {
    user_name = data.student.name;
  }

  let roll_no = "N/A";
  if (data.student && data.student.rollNumber) {
    roll_no = data.student.rollNumber;
  }

  let sem = 3;
  if (data.student && data.student.semester) {
    sem = data.student.semester;
  }

  let sec = "A";
  if (data.student && data.student.section) {
    sec = data.student.section;
  }

  let total_classes = 0;
  if (data.overall && data.overall.totalClasses) {
    total_classes = data.overall.totalClasses;
  }

  let attended_classes = 0;
  if (data.overall && data.overall.attendedClasses) {
    attended_classes = data.overall.attendedClasses;
  }

  let overall_pct = 100;
  if (data.overall && data.overall.overallPercentage !== undefined) {
    overall_pct = data.overall.overallPercentage;
  }

  let overall_class = "text-danger";
  if (overall_pct >= 75) {
    overall_class = "text-success";
  }

  let shortage_warning = null;
  if (data.overall && data.overall.isShortage) {
    shortage_warning = (
      <div className="alert alert-danger">
        <strong>Warning:</strong> Your overall attendance is below 75%. Please check your subjects below.
      </div>
    );
  }

  const subjects = data.subjects || [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Attendance Summary</h1>
          <p className="page-subtitle">Track your subject attendance and shortage status in real time</p>
        </div>
        <button type="button" onClick={load_data} className="btn btn-secondary">
          Refresh Data
        </button>
      </div>

      <div className="student-hero-card">
        <div className="student-profile-info">
          <div className="student-avatar-badge">
            {user_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="student-name-title">{user_name}</h2>
            <div className="student-meta-tags">
              <span className="meta-tag">Roll No: <strong>{roll_no}</strong></span>
              <span className="meta-tag">Semester {sem}</span>
              <span className="meta-tag">Section {sec}</span>
            </div>
          </div>
        </div>

        <div className="student-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Classes</span>
            <span className="kpi-value">{total_classes}</span>
            <span className="kpi-sub">Across all subjects</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Classes Attended</span>
            <span className="kpi-value text-success">{attended_classes}</span>
            <span className="kpi-sub">Sessions present</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Overall Percentage</span>
            <span className={"kpi-value " + overall_class}>{overall_pct}%</span>
            <span className="kpi-sub">{overall_pct >= 75 ? "Above 75% requirement" : "Shortage alert (<75%)"}</span>
          </div>
        </div>
      </div>

      {shortage_warning}

      <div className="section-block">
        <div className="section-header-row">
          <div>
            <h2 className="section-subtitle">Subject-Wise Breakdown</h2>
            <p className="section-hint">Click into any subject to review date-wise class logs</p>
          </div>
          <span className="count-pill">{subjects.length} Subjects</span>
        </div>

        <div className="subjects-grid">
          {subjects.map((sub) => {
            let badge_class = "badge-danger";
            let bar_class = "bg-danger";
            let status_text = "Shortage";
            if (sub.percentage >= 75) {
              badge_class = "badge-success";
              bar_class = "bg-success";
              status_text = "Eligible";
            }

            let advice;
            if (sub.isShortage) {
              advice = (
                <div className="stretch-goal-banner">
                  <span className="goal-icon">⚠️</span>
                  <div className="goal-text">
                    Must attend <strong>{sub.classesNeeded} consecutive {sub.classesNeeded === 1 ? "class" : "classes"}</strong> to reach 75%.
                  </div>
                </div>
              );
            } else {
              advice = (
                <div className="safe-margin-banner">
                  <span className="goal-icon">✓</span>
                  <span className="goal-text">Attendance is on track. Good job!</span>
                </div>
              );
            }

            let bar_width = sub.percentage;
            if (bar_width > 100) {
              bar_width = 100;
            }

            return (
              <div key={sub.subjectId} className="subject-card">
                <div className="subject-card-header">
                  <div className="subject-card-titles">
                    <span className="code-pill">{sub.code}</span>
                    <h3 className="subject-name">{sub.name}</h3>
                    <p className="subject-teacher">Faculty: {sub.teacherName}</p>
                  </div>
                  <span className={"badge " + badge_class}>{sub.percentage}%</span>
                </div>

                <div className="progress-bar-container">
                  <div className="progress-bar-bg">
                    <div
                      className={"progress-bar-fill " + bar_class}
                      style={{ width: bar_width + "%" }}
                    ></div>
                  </div>
                  <div className="progress-meta-row">
                    <span>
                      Attended: <strong>{sub.attendedClasses}</strong> / {sub.totalClasses} classes
                    </span>
                    <span className={"status-tag " + (sub.percentage >= 75 ? "tag-eligible" : "tag-shortage")}>
                      {status_text}
                    </span>
                  </div>
                </div>

                {advice}

                <div className="card-action-footer">
                  <Link
                    to={"/my-attendance/" + sub.subjectId}
                    className="btn btn-outline btn-block"
                  >
                    View Date-Wise History →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
