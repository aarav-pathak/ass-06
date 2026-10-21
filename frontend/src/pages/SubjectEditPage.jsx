import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubjectForm from "../components/SubjectForm";
import { getSubjectById, updateSubject } from "../api/subjectApi";

export default function SubjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    getSubjectById(id)
      .then((res) => {
        setSub(res.subject);
        setLoading(false);
      })
      .catch((error) => {
        setErr(error.message);
        setLoading(false);
      });
  }, [id]);

  const on_update = (form_data) => {
    updateSubject(id, form_data)
      .then(() => {
        navigate("/admin/subjects");
      })
      .catch((error) => {
        setErr(error.message);
      });
  };

  if (loading) {
    return (
      <div className="page-container form-page-container">
        <p>Loading subject details...</p>
      </div>
    );
  }

  let initial_data = {};
  if (sub) {
    initial_data = sub;
  }

  return (
    <div className="page-container form-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Subject</h1>
          <p className="page-subtitle">Update subject information</p>
        </div>
      </div>

      <div className="form-card-wrapper">
        <SubjectForm
          initialData={initial_data}
          onSubmit={on_update}
          serverError={err}
          isEdit={true}
        />
      </div>
    </div>
  );
}
