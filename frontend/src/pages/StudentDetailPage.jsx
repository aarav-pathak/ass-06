import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentSubjectDetail } from "../api/attendanceApi";

export default function StudentDetailPage() {
  const { subjectId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) {
      return;
    }
    getStudentSubjectDetail(subjectId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [subjectId]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading attendance history...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-container">
        <p>No attendance records found.</p>
      </div>
    );
  }

  let badge_class = "badge-danger";
  if (data.stats && data.stats.percentage >= 75) {
    badge_class = "badge-success";
  }

  let advice_banner = null;
  if (data.stats && data.stats.isShortage) {
    advice_banner = (
      <div className="alert alert-warning stretch-goal-alert">
        <div>
          <strong>Target:</strong> You need to attend{" "}
          <strong>{data.stats.classesNeeded} consecutive classes</strong> in this subject to reach 75%.
        </div>
      </div>
    );
  }

  const history = data.history || [];

  let history_table;
  if (history.length === 0) {
    history_table = (
      <div className="state-card empty-state">
        <h3>No sessions marked yet</h3>
        <p>Attendance has not been recorded for this subject yet.</p>
      </div>
    );
  } else {
    history_table = (
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>#</th>
              <th>Class Date</th>
              <th>Recorded Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => {
              let row_class = "row-absent";
              let chip_class = "chip-absent";
              if (record.status === "Present") {
                row_class = "row-present";
                chip_class = "chip-present";
              }

              return (
                <tr key={record.date + "_" + index} className={row_class}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{record.date}</strong>
                  </td>
                  <td>
                    <span className={"status-chip " + chip_class}>
                      {record.status}
                    </span>
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
      <div className="back-nav">
        <Link to="/my-attendance" className="link-back">
          Back to Attendance Summary
        </Link>
      </div>

      <div className="page-header detail-header">
        <div>
          <span className="code-pill">{data.subject?.code}</span>
          <h1 className="page-title">{data.subject?.name}</h1>
          <p className="page-subtitle">
            Teacher: {data.subject?.teacherName} - Semester {data.subject?.semester}
          </p>
        </div>
        <div className="detail-stat-badge">
          <span className={"badge-large " + badge_class}>
            {data.stats?.percentage}%
          </span>
          <span className="badge-caption">
            {data.stats?.attendedClasses} / {data.stats?.totalClasses} classes attended
          </span>
        </div>
      </div>

      {advice_banner}

      <div className="section-block">
        <h2 className="section-subtitle">Date-Wise Attendance Records</h2>
        {history_table}
      </div>
    </div>
  );
}
