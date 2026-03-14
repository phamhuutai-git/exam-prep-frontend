import React from "react";
const MOCK_RESULTS = [
  {
    student: "Dung Pham",
    class: "Railway01",
    exam: "Java Basic Test",
    score: 8,
    time: "25 min",
    date: "2024-04-01",
    status: "SUBMITTED",
  },
  {
    student: "Huy Hoang",
    class: "Railway02",
    exam: "Spring Test",
    score: 7,
    time: "35 min",
    date: "2024-04-01",
    status: "SUBMITTED",
  },
  {
    student: "Dung Pham",
    class: "Railway01",
    exam: "SQL Test",
    score: 6,
    time: "30 min",
    date: "2024-04-02",
    status: "SUBMITTED",
  },
  {
    student: "Huy Hoang",
    class: "Railway02",
    exam: "HTML Test",
    score: 9,
    time: "20 min",
    date: "2024-04-02",
    status: "SUBMITTED",
  },
  {
    student: "Dung Pham",
    class: "Railway01",
    exam: "JS Test",
    score: 10,
    time: "25 min",
    date: "2024-04-03",
    status: "SUBMITTED",
  },
];
const TeacherStudents = () => {
  return (
    <div style={{ color: "white" }}>
      <h1>Student Management</h1>
      <p>Danh sách học sinh sẽ hiển thị ở đây</p>
    </div>
  );
};

export default TeacherStudents;
