import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getShortageList } from "../api/attendanceApi";
import { getSubjects } from "../api/subjectApi";

export default function ShortageListPage() {
  const [params, set_params] = useSearchParams();

  const sem_filter = params.get("semester") || "";
  const sub_filter = params.get("subjectId") || "";

  const [list, setList] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects().then((res) => {
      setSubs(res.subjects || []);
    });
  }, []);

  useEffect(() => {
    const filters = {};
    if (sem_filter) {
      filters.semester = sem_filter;
    }
    if (sub_filter) {
      filters.subjectId = sub_filter;
    }

    getShortageList(filters).then((res) => {
      setList(res.shortages || []);
      setLoading(false);
    });
  }, [sem_filter, sub_filter]);

  const on_sem_change = (event) => {
    const val = event.target.value;
    const next_params = {};
    if (val) {
      next_params.semester = val;
    }
    if (sub_filter) {
      next_params.subjectId = sub_filter;
    }
    set_params(next_params);
  };

  const on_sub_change = (event) => {
    const val = event.target.value;
    const next_params = {};
    if (sem_filter) {
      next_params.semester = sem_filter;
    }
    if (val) {
      next_params.subjectId = val;
    }
    set_params(next_params);
  };

  let content;
  if (loading) {
    content = <p>Checking attendance shortages...</p>;
  } else if (list.length === 0) {
    content = (
      <div className="state-card empty-state success-state">
        <h3>No Attendance Shortages</h3>
        <p>All students meet the 75% attendance requirement for these filters.</p>
      </div>
    );
  } else {
    content = (
      <div className="table-responsive">
        <table className="data-table shortage-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Sem &amp; Sec</th>
              <th>Subject</th>
              <th>Classes Attended</th>
              <th>Attendance %</th>
              <th>Classes Needed to Reach 75%</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr
                key={item.studentId + "_" + item.subjectId + "_" + index}
                className="shortage-row"
              >
                <td>
                  <span className="code-pill text-danger">{item.rollNumber}</span>
                </td>
                <td>
                  <strong>{item.studentName}</strong>
                </td>
                <td>
                  Sem {item.semester} ({item.section})
                </td>
                <td>
                  <div>
                    <strong>{item.subjectName}</strong>
                    <div className="text-muted small">
                      {item.subjectCode} - {item.teacherName}
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{item.attendedClasses}</strong> / {item.totalClasses} classes
                </td>
                <td>
                  <span className="badge badge-danger">{item.percentage}%</span>
                </td>
                <td>
                  <div className="recovery-pill">
                    <span className="recovery-num">+{item.classesNeeded}</span>
                    <span className="recovery-label">consecutive classes needed</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Shortage List (Below 75%)</h1>
          <p className="page-subtitle">
            Students whose attendance has dropped below 75% with recovery targets.
          </p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Dashboard
        </Link>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="semesterFilter">Filter by Semester:</label>
          <select
            id="semesterFilter"
            value={sem_filter}
            onChange={on_sem_change}
            className="filter-select"
          >
            <option value="">All Semesters</option>
            {semesters.map((num) => (
              <option key={num} value={num}>
                Semester {num}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="subjectFilter">Filter by Subject:</label>
          <select
            id="subjectFilter"
            value={sub_filter}
            onChange={on_sub_change}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            {subs.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          <span className="badge badge-danger">{list.length} shortage records</span>
        </div>
      </div>

      {content}
    </div>
  );
}
