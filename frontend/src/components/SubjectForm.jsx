import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubjectForm({
  initialData = {},
  onSubmit,
  loading = false,
  serverError = "",
  isEdit = false,
}) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: initialData.name || "",
    code: initialData.code || "",
    semester: initialData.semester || 3,
    teacherName: initialData.teacherName || "",
  });

  const [err, setErr] = useState("");

  const on_change = (event) => {
    const field = event.target.name;
    let val = event.target.value;
    if (field === "semester") {
      val = Number(val);
    }
    setData({
      ...data,
      [field]: val,
    });
    setErr("");
  };

  const on_submit = (event) => {
    event.preventDefault();
    if (!data.name.trim() || !data.code.trim() || !data.teacherName.trim()) {
      setErr("Please fill all required fields.");
      return;
    }
    onSubmit(data);
  };

  let btn_text = "Create Subject";
  if (isEdit) {
    btn_text = "Update Subject";
  }
  if (loading) {
    btn_text = "Saving...";
  }

  let server_alert = null;
  if (serverError) {
    server_alert = <div className="alert alert-error">{serverError}</div>;
  }

  let error_alert = null;
  if (err) {
    error_alert = <div className="alert alert-warning">{err}</div>;
  }

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <form onSubmit={on_submit} className="card-form">
      {server_alert}
      {error_alert}

      <div className="form-group">
        <label htmlFor="name">Subject Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={data.name}
          onChange={on_change}
          placeholder="e.g. Web Technology"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="code">Subject Code *</label>
          <input
            id="code"
            name="code"
            type="text"
            value={data.code}
            onChange={on_change}
            placeholder="e.g. CS301"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="semester">Semester *</label>
          <select
            id="semester"
            name="semester"
            value={data.semester}
            onChange={on_change}
            required
          >
            {semesters.map((num) => (
              <option key={num} value={num}>
                Semester {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="teacherName">Teacher Name *</label>
        <input
          id="teacherName"
          name="teacherName"
          type="text"
          value={data.teacherName}
          onChange={on_change}
          placeholder="e.g. Dr. Anita Sen"
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => navigate("/admin/subjects")}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {btn_text}
        </button>
      </div>
    </form>
  );
}
