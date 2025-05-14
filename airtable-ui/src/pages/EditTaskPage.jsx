import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ Name: "", Status: "", Notes: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/edit/${id}`)
      .then((res) => res.text())
      .then((html) => {
        document.getElementById("edit-form-container").innerHTML = html;
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">✏️ Edit Task</h2>
      {loading ? <p>Loading...</p> : <div id="edit-form-container" />}
      <button
        onClick={() => navigate("/records")}
        className="mt-4 text-sm text-blue-600 underline"
      >
        ← Back to Records
      </button>
    </div>
  );
}
