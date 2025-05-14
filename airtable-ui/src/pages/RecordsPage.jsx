import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/records")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch records");
        return res.json();
      })
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
   <div className="overflow-x-auto rounded shadow-md border border-gray-300 bg-white p-4">

  <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-x-4 border-spacing-y-2">

    <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
      <tr>
         <th className="px-4 py-3">✏️</th>
        <th className="px-4 py-3 whitespace-nowrap">Record ID</th>
        <th className="px-4 py-3">Name</th>
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3">Notes</th>
        <th className="px-4 py-3 whitespace-nowrap">Created Time</th>
        
      </tr>
    </thead>
    <tbody>
      {records.map((record, idx) => (
        <tr key={idx} className="border-t hover:bg-slate-50">
            <td className="border px-4 py-2">
<a
  href={`/edit/${record["Record ID"]}`}
  className="text-blue-600 hover:underline"
  target="_blank"
  rel="noopener noreferrer"
>
  Edit
</a>
        </td>
         <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
            {record["Record ID"] || "—"}
          </td>
          <td className="px-4 py-2">{record.Name || "—"}</td>
          <td className="px-4 py-2">{record.Status || "—"}</td>
          <td className="px-4 py-2">{record.Notes || "—"}</td>
            <td className="px-4 py-2">
            {record["Created time"]
                ? new Date(record["Created time"]).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short"
                })
                : "—"}
            </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
