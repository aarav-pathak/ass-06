import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getSubjects, deleteSubject } from "../api/subjectApi";

export default function SubjectListPage() {
  const [params, set_params] = useSearchParams();
  const sem_filter = params.get("semester") || "";

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let filter = undefined;
    if (sem_filter) {
      filter = sem_filter;
    }
    getSubjects(filter)
      .then((res) => {
        setSubs(res.subjects || []);
        setLoading(false);
      })
      .catch((error) => {
        setErr(error.message);
        setLoading(false);
      });
  }, [sem_filter]);

  const on_sem_change = (event) => {
    const val = event.target.value;
    if (val) {
      set_params({ semester: val });
    } else {
      set_params({});
    }
  };

  const on_delete = (id, name) => {
    if (!window.confirm("Are you sure you want to delete " + name + "?")) {
      return;
    }
    deleteSubject(id)
      .then(() => {
        setMsg("Subject " + name + " deleted.");
        setSubs(subs.filter((sub) => sub._id !== id));
      })
      .catch((error) => {
        setErr(error.message);
      });
  };

  let action_alert = null;
  if (msg) {
    action_alert = <div className="alert alert-success">{msg}</div>;
  }

  let error_alert = null;
  if (err) {
    error_alert = <div className="alert alert-error">{err}</div>;
  }

  let content;
  if (loading) {
    content = <p>Loading subjects...</p>;
  } else if (subs.length === 0) {
    let empty_text = "No subjects registered in the system yet.";
    if (sem_filter) {
      empty_text = "No subjects registered for Semester " + sem_filter + ".";
    }
    content = (
      <div className="state-card empty-state">
        <h3>No subjects found</h3>
        <p>{empty_text}</p>
        <Link to="/admin/subjects/new" className="btn btn-primary">
          Create New Subject
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Semester</th>
              <th>Faculty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
              <tr key={sub._id}>
                <td>
                  <span className="code-pill">{sub.code}</span>
                </td>
                <td>
                  <strong>{sub.name}</strong>
                </td>
                <td>Semester {sub.semester}</td>
                <td>{sub.teacherName}</td>
                <td>
                  <div className="table-actions">
                    <Link
                      to={"/admin/subjects/" + sub._id + "/edit"}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => on_delete(sub._id, sub.name)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
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
          <h1 className="page-title">Subjects Directory</h1>
          <p className="page-subtitle">Manage subjects and faculty assignments</p>
        </div>
        <Link to="/admin/subjects/new" className="btn btn-primary">
          Add Subject
        </Link>
      </div>

      {action_alert}
      {error_alert}

      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="semFilter">Filter by Semester:</label>
          <select
            id="semFilter"
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
        <div className="filter-info">
          <span>Total: {subs.length} subjects</span>
        </div>
      </div>

      {content}
    </div>
  );
}
