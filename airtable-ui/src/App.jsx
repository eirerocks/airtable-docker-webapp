import { Routes, Route, Link } from "react-router-dom";
import RecordsPage from "./pages/RecordsPage";
import AddTaskPage from "./pages/AddTaskPage";
import EditTaskPage from "./pages/EditTaskPage";

// Placeholder for the Add Task route
function AddTask() {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold text-green-700">➕ Add a New Task</h2>
      <p>This is where your task form will go.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 bg-slate-100 text-slate-900">
      <h1 className="text-4xl font-bold text-blue-800 mb-2">
        🚀 Airtable Task Manager
      </h1>

      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center space-y-6">
              <p className="text-lg">Welcome! Choose an option:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/records"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Tasks
                </Link>
                <Link
                  to="/add-task"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Add Task
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/edit/:id" element={<EditTaskPage />} />

      </Routes>
    </div>
  );
}
