import React from "react";
const MOCK_QUESTIONS = [
  { id: 1, content: "What is Java?", difficulty: "EASY", category: "Java" },
  {
    id: 2,
    content: "Explain OOP principles",
    difficulty: "MEDIUM",
    category: "Java",
  },
  {
    id: 3,
    content: "What is Spring Boot?",
    difficulty: "EASY",
    category: "Spring",
  },
  {
    id: 4,
    content: "What is Primary Key?",
    difficulty: "EASY",
    category: "SQL",
  },
  { id: 5, content: "What is HTML?", difficulty: "EASY", category: "HTML" },
];

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

const CATEGORIES = ["Java", "Spring", "SQL", "HTML", "JavaScript"];
const TeacherQuestions = () => {
  return <div>TeacherQuestions</div>;
};

export default TeacherQuestions;
