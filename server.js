const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/attendance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

// Student Schema
const studentSchema = new mongoose.Schema({
  matricId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  attendance: [
    {
      date: String,
      status: { type: String, enum: ["Present", "Absent"] },
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

// ---------------------- ROUTES ---------------------- //

// ✅ Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

// ✅ Get a specific student by matricId
app.get("/api/students/:matricId", async (req, res) => {
  try {
    const student = await Student.findOne({ matricId: req.params.matricId.trim() });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ matricId: student.matricId, name: student.name });
  } catch (err) {
    res.status(500).json({ message: "Error fetching student", error: err.message });
  }
});

// ✅ Add a new student
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: "Failed to add student", error: err.message });
  }
});

// ✅ Update a student
app.patch("/api/students/:matricId", async (req, res) => {
  try {
    const { name } = req.body;
    const filter = { matricId: req.params.matricId.trim() };

    const updatedStudent = await Student.findOneAndUpdate(
      filter,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found for update" });
    }

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// ✅ Delete a student
app.delete("/api/students/:matricId", async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({ matricId: req.params.matricId.trim() });
    if (!deleted) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Deleted", deleted });
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
});

// ✅ Mark attendance
app.post("/api/students/:matricId/attendance", async (req, res) => {
  try {
    const { status } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const student = await Student.findOne({ matricId: req.params.matricId.trim() });
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.attendance.push({ date, status });
    await student.save();

    res.json({ message: "Attendance marked", student });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark attendance", error: err.message });
  }
});

// ✅ Get attendance summary
app.get("/api/students/:matricId/summary", async (req, res) => {
  try {
    const student = await Student.findOne({ matricId: req.params.matricId.trim() });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const total = student.attendance.length;
    const present = student.attendance.filter(a => a.status === "Present").length;
    const absent = total - present;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

    res.json({ total, present, absent, percentage });
  } catch (err) {
    res.status(500).json({ message: "Failed to get summary", error: err.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
