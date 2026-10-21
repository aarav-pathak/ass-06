import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getSubjects } from "../api/subjectApi";
import { getAttendanceSheet, markAttendance } from "../api/attendanceApi";

export default function AttendanceMarkPage() {
  const [params, set_params] = useSearchParams();

  const sub_id = params.get("subjectId") || "";
  const date = params.get("date") || new Date().toISOString().split("T")[0];

  const [subs, setSubs] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getSubjects()
      .then((res) => {
        const list = res.subjects || [];
        setSubs(list);
        setLoading(false);
        if (!sub_id && list.length > 0) {
          set_params({
            subjectId: list[0]._id,
            date: date,
          });
        }
      })
      .catch((error) => {
        setErr(error.message);
        setLoading(false);
      });
  }, [date, sub_id, set_params]);

  useEffect(() => {
    if (!sub_id || !date) {
      return;
    }
    getAttendanceSheet(sub_id, date)
      .then((res) => {
        setSheet(res);
        setRecords(res.records || []);
      })
      .catch((error) => {
        setErr(error.message);
      });
  }, [sub_id, date]);

  const on_sub_change = (event) => {
    set_params({
      subjectId: event.target.value,
      date: date,
    });
  };

  const on_date_change = (event) => {
    set_params({
      subjectId: sub_id,
      date: event.target.value,
    });
  };

  const toggle_status = (id) => {
    const updated = records.map((item) => {
      if (item.studentId === id) {
        let next_status = "Present";
        if (item.status === "Present") {
          next_status = "Absent";
        }
        return {
          ...item,
          status: next_status,
        };
      }
      return item;
    });
    setRecords(updated);
    setMsg("");
  };

  const mark_all = (status) => {
    const updated = records.map((item) => ({
      ...item,
      status: status,
    }));
    setRecords(updated);
    setMsg("");
  };

  const on_save = (event) => {
    event.preventDefault();
    setSaving(true);
    setErr("");
    setMsg("");

    markAttendance({
      subjectId: sub_id,
      date: date,
      records: records,
    })
      .then(() => {
        setMsg("Attendance saved successfully for " + date);
        setSaving(false);
        getAttendanceSheet(sub_id, date).then((res) => {
          setSheet(res);
        });
      })
      .catch((error) => {
        setErr(error.message);
        setSaving(false);
      });
  };

  let present_count = 0;
  let absent_count = 0;
  for (let i = 0; i < records.length; i++) {
    if (records[i].status === "Present") {
      present_count = present_count + 1;
    } else {
      absent_count = absent_count + 1;
    }
  }

  let rate = 0;
  if (records.length > 0) {
    rate = ((present_count / records.length) * 100).toFixed(1);
  }

  let msg_alert = null;
  if (msg) {
    msg_alert = <div className="alert alert-success">{msg}</div>;
  }

  let error_alert = null;
  if (err) {
    error_alert = <div className="alert alert-error">{err}</div>;
  }

  let sheet_banner = null;
  if (sheet) {
    if (sheet.exists) {
      sheet_banner = (
        <div className="sheet-status-banner status-existing">
          <p>
            <strong>Existing Attendance Sheet:</strong> Attendance was already marked for this subject on {date}. You are editing the existing sheet.
          </p>
        </div>
      );
    } else {
      sheet_banner = (
        <div className="sheet-status-banner status-new">
          <p>
            <strong>New Attendance Sheet:</strong> Creating new attendance record for {date}. Default is Present.
          </p>
        </div>
      );
    }
  }

  let btn_submit_text = "Submit Attendance Sheet";
  if (sheet && sheet.exists) {
    btn_submit_text = "Update Attendance Sheet";
  }
  if (saving) {
    btn_submit_text = "Saving Attendance...";
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Subject Attendance</h1>
          <p className="page-subtitle">Record daily attendance for students</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Dashboard
        </Link>
      </div>

      <div className="card-selector-bar">
        <div className="selector-group">
          <label htmlFor="subjectSelect">Select Subject:</label>
          <select
            id="subjectSelect"
            value={sub_id}
            onChange={on_sub_change}
            disabled={loading || saving}
            className="select-input"
          >
            {subs.map((item) => (
              <option key={item._id} value={item._id}>
                {item.code} - {item.name} (Sem {item.semester})
              </option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <label htmlFor="dateSelect">Attendance Date:</label>
          <input
            id="dateSelect"
            type="date"
            value={date}
            onChange={on_date_change}
            max={new Date().toISOString().split("T")[0]}
            disabled={saving}
            className="date-input"
          />
        </div>
      </div>

      {msg_alert}
      {error_alert}
      {sheet_banner}

      <form onSubmit={on_save}>
        <div className="attendance-toolbar">
          <div className="attendance-counters">
            <span className="counter-item">
              Total: <strong>{records.length}</strong>
            </span>
            <span className="counter-item text-success">
              Present: <strong>{present_count}</strong>
            </span>
            <span className="counter-item text-danger">
              Absent: <strong>{absent_count}</strong>
            </span>
            <span className="counter-item">
              Rate: <strong>{rate}%</strong>
            </span>
          </div>

          <div className="quick-actions">
            <button
              type="button"
              onClick={() => mark_all("Present")}
              className="btn btn-sm btn-outline"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => mark_all("Absent")}
              className="btn btn-sm btn-outline"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table attendance-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Section</th>
                <th style={{ textAlign: "center", width: "180px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((student, index) => {
                let row_class = "row-absent";
                let btn_class = "btn-absent";
                if (student.status === "Present") {
                  row_class = "row-present";
                  btn_class = "btn-present";
                }

                return (
                  <tr key={student.studentId} className={row_class}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="code-pill">{student.rollNumber}</span>
                    </td>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>Sec {student.section}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => toggle_status(student.studentId)}
                        className={"btn-toggle-status " + btn_class}
                      >
                        {student.status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="form-submit-footer">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {btn_submit_text}
          </button>
        </div>
      </form>
    </div>
  );
}
