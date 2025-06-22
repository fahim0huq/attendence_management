function calculateAttendance(attendanceArray) {
  const total = attendanceArray.length;
  const present = attendanceArray.filter(a => a.status === "Present").length;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
  return {
    total,
    present,
    absent: total - present,
    percentage
  };
}

module.exports = {
  calculateAttendance
};
