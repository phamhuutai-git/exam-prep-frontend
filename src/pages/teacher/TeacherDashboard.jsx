import { useState } from "react";


const STATS = [
  {
    label: "Tổng đề thi",
    value: 5,
    sub: "+2 tháng này",
    color: "#E6F1FB",
    text: "#185FA5",
  },
  {
    label: "Tổng câu hỏi",
    value: 5,
    sub: "+1 tháng này",
    color: "#EAF3DE",
    text: "#3B6D11",
  },
  {
    label: "Lượt thi",
    value: 5,
    sub: "trong 30 ngày",
    color: "#FAEEDA",
    text: "#854F0B",
  },
  {
    label: "Điểm trung bình",
    value: "8.0",
    sub: "trên thang 10",
    color: "#FBEAF0",
    text: "#993556",
  },
];

const RECENT_EXAMS = [
  {
    code: "EX001",
    title: "Java Basic Test",
    category: "Java",
    attempts: 1,
    avgScore: 8.0,
    date: "2024-03-01",
  },
  {
    code: "EX003",
    title: "SQL Test",
    category: "SQL",
    attempts: 1,
    avgScore: 6.0,
    date: "2024-03-03",
  },
  {
    code: "EX005",
    title: "JS Test",
    category: "JavaScript",
    attempts: 1,
    avgScore: 10.0,
    date: "2024-03-05",
  },
];

const RECENT_ATTEMPTS = [
  {
    student: "Dung Pham",
    exam: "Java Basic Test",
    score: 8.0,
    date: "2024-04-01",
  },
  { student: "Dung Pham", exam: "SQL Test", score: 6.0, date: "2024-04-02" },
  { student: "Dung Pham", exam: "JS Test", score: 10.0, date: "2024-04-03" },
];

const SCORE_DIST = [
  { range: "0–4", count: 0 },
  { range: "4–5", count: 0 },
  { range: "5–6", count: 0 },
  { range: "6–7", count: 1 },
  { range: "7–8", count: 0 },
  { range: "8–9", count: 1 },
  { range: "9–10", count: 1 },
];

const CATEGORY_COLORS = {
  Java: { bg: "#EAF3DE", text: "#3B6D11" },
  Spring: { bg: "#E1F5EE", text: "#0F6E56" },
  SQL: { bg: "#E6F1FB", text: "#185FA5" },
  HTML: { bg: "#FAEEDA", text: "#854F0B" },
  JavaScript: { bg: "#FBEAF0", text: "#993556" },
};

const Badge = ({ label }) => {
  const c = CATEGORY_COLORS[label] || { bg: "#F1EFE8", text: "#5F5E5A" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 99,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
};

const ScoreChip = ({ score }) => {
  const color = score >= 8 ? "#3B6D11" : score >= 6 ? "#854F0B" : "#A32D2D";
  const bg = score >= 8 ? "#EAF3DE" : score >= 6 ? "#FAEEDA" : "#FCEBEB";
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 99,
        fontWeight: 500,
      }}
    >
      {score.toFixed(1)}
    </span>
  );
};

const maxCount = Math.max(...SCORE_DIST.map((d) => d.count), 1);

export default function TeacherDashboard() {
  return <div>TeacherDashboard</div>;
}
