import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

function EditStudent() {
  const { matricId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({ matricId: "", name: "" });
  const [loading, setLoading] = useState(true);

  // Load student data on page load
  useEffect(() => {
    axios.get(`${API}/students/${matricId}`)
      .then((res) => {
        setStudent({
          matricId: res.data.matricId,
          name: res.data.name,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading student:", err);
        alert("Failed to load student data.");
        setLoading(false);
      });
  }, [matricId]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`${API}/students/${matricId}`, {
        matricId: student.matricId,
        name: student.name,
      });
      alert("Student updated successfully");
      navigate("/");
    } catch (err) {
      alert("Failed to update student");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading student data...</p>;

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "100px auto",
        backgroundColor: "#f6fff6",
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Edit Student</h2>

      <label>Matric ID</label>
      <input
        name="matricId"
        value={student.matricId}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Name</label>
      <input
        name="name"
        value={student.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <button onClick={handleUpdate} style={{ width: "100%" }}>
        💾 Update
      </button>
    </div>
  );
}

export default EditStudent;
