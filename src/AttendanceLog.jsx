import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

function AttendanceLog() {
  const { matricId } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`${API}/students`).then(res => {
      const found = res.data.find(s => s.matricId === matricId);
      setStudent(found);
    });
  }, [matricId]);

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Attendance Log for {student?.name}</h2>
      <ul>
        {student?.attendance.map((a, i) => (
          <li key={i}>
            {a.date}: <strong>{a.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendanceLog;
