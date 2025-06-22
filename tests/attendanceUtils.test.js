const { calculateAttendance } = require("../utils/attendanceUtils");

describe("Attendance Percentage Calculation", () => {
  test("Should return 100% if all are present", () => {
    const data = [
      { date: "2024-01-01", status: "Present" },
      { date: "2024-01-02", status: "Present" },
    ];
    const result = calculateAttendance(data);
    expect(result.percentage).toBe(100);
    expect(result.present).toBe(2);
    expect(result.absent).toBe(0);
  });

  test("Should return 50% if half are present", () => {
    const data = [
      { date: "2024-01-01", status: "Present" },
      { date: "2024-01-02", status: "Absent" },
    ];
    const result = calculateAttendance(data);
    expect(result.percentage).toBe(50);
    expect(result.present).toBe(1);
    expect(result.absent).toBe(1);
  });

  test("Should return 0% if none are present", () => {
    const data = [
      { date: "2024-01-01", status: "Absent" },
      { date: "2024-01-02", status: "Absent" },
    ];
    const result = calculateAttendance(data);
    expect(result.percentage).toBe(0);
    expect(result.present).toBe(0);
    expect(result.absent).toBe(2);
  });

  test("Should handle empty array", () => {
    const result = calculateAttendance([]);
    expect(result.percentage).toBe(0);
    expect(result.present).toBe(0);
    expect(result.absent).toBe(0);
    expect(result.total).toBe(0);
  });
});
