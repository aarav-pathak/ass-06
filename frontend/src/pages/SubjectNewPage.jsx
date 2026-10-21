import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectForm from "../components/SubjectForm";
import { createSubject } from "../api/subjectApi";

export default function SubjectNewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const on_save = (form_data) => {
    setLoading(true);
    createSubject(form_data)
      .then(() => {
        navigate("/admin/subjects");
      })
      .catch((error) => {
        setErr(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="page-container form-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Subject</h1>
          <p className="page-subtitle">Add a new subject for attendance</p>
        </div>
      </div>

      <div className="form-card-wrapper">
        <SubjectForm
          onSubmit={on_save}
          loading={loading}
          serverError={err}
          isEdit={false}
        />
      </div>
    </div>
  );
}
