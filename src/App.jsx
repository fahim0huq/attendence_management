import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "/api";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ matricId: "", name: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(`${API}/students`);
    const enriched = await Promise.all(
      res.data.map(async (s) => {
        const summary = await axios.get(`${API}/students/${s.matricId}/summary`);
        return { ...s, summary: summary.data };
      })
    );
    setStudents(enriched);
  };

  const addStudent = async () => {
    if (!form.matricId || !form.name) return alert("Fill in both fields");
    try {
      await axios.post(`${API}/students`, form);
      setForm({ matricId: "", name: "" });
      fetchStudents();
    } catch (err) {
      alert("Matric ID must be unique");
    }
  };

  const deleteStudent = async (id) => {
    await axios.delete(`${API}/students/${id}`);
    fetchStudents();
  };

  const markAttendance = async (id, status) => {
    await axios.post(`${API}/students/${id}/attendance`, { status });
    fetchStudents();
  };

  return (
    <div
      style={{
        backgroundColor: "#e6ffe6",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          width: "60%",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>🎓 Student Attendance</h1>

        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <input
            placeholder="Matric ID"
            value={form.matricId}
            onChange={(e) => setForm({ ...form, matricId: e.target.value })}
            style={{ flex: 1 }}
          />
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ flex: 1 }}
          />
          <button onClick={addStudent}>Add</button>
        </div>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            textAlign: "center",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead style={{ backgroundColor: "#ccffcc" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Total</th>
              <th>Present</th>
              <th>Absent</th>
              <th>%</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.matricId}>
                <td>{s.matricId}</td>
                <td>{s.name}</td>
                <td>{s.summary.total}</td>
                <td>{s.summary.present}</td>
                <td>{s.summary.absent}</td>
                <td>{s.summary.percentage}%</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                    <button onClick={() => markAttendance(s.matricId, "Present")}>✅</button>
                    <button onClick={() => markAttendance(s.matricId, "Absent")}>❌</button>
                    <Link to={`/edit/${s.matricId}`}>
                      <button>✏️</button>
                    </Link>
                    <button onClick={() => deleteStudent(s.matricId)}>🗑️</button>
                    <Link to={`/attendance/${s.matricId}`}>
                      <button>📅</button>
                    </Link>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
