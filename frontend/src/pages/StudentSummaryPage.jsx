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
          <p className="page-subtitle">Track your subject attendance and shortage status</p>
        </div>
        <button type="button" onClick={load_data} className="btn btn-secondary">
          Refresh
        </button>
      </div>

      <div className="student-overview-card">
        <div className="overview-profile">
          <div>
            <h2>{user_name}</h2>
            <p className="overview-meta">
              Roll No: <strong>{roll_no}</strong> - Semester {sem} - Section {sec}
            </p>
          </div>
        </div>

        <div className="overview-stats">
          <div className="stat-pill">
            <span className="stat-label">Total Classes</span>
            <span className="stat-num">{total_classes}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Attended</span>
            <span className="stat-num text-success">{attended_classes}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Overall Percentage</span>
            <span className={"stat-num " + overall_class}>{overall_pct}%</span>
          </div>
        </div>
      </div>

      {shortage_warning}

      <div className="section-block">
        <h2 className="section-subtitle">Subject-Wise Breakdown</h2>

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
                  <div className="goal-text">
                    Must attend <strong>{sub.classesNeeded} consecutive classes</strong> to reach 75%.
                  </div>
                </div>
              );
            } else {
              advice = (
                <div className="safe-margin-banner">
                  <span className="goal-text">Attendance is on track.</span>
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
                  <div>
                    <span className="code-pill">{sub.code}</span>
                    <h3 className="subject-name">{sub.name}</h3>
                    <p className="subject-teacher">{sub.teacherName}</p>
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
                      Attended: {sub.attendedClasses} / {sub.totalClasses} classes
                    </span>
                    <span>{status_text}</span>
                  </div>
                </div>

                {advice}

                <div className="card-action-footer">
                  <Link
                    to={"/my-attendance/" + sub.subjectId}
                    className="btn btn-outline btn-block"
                  >
                    View Date-Wise History
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
