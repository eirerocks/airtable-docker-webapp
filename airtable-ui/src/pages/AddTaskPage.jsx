import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTaskPage() {
  const [form, setForm] = useState({ Name: "", Status: "New", Notes: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create task");
      navigate("/records");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">➕ Add a New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="Name"
            value={form.Name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="Status"
            value={form.Status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option>New</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            name="Notes"
            value={form.Notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
