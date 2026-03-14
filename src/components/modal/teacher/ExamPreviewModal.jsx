// ExamPreviewModal.jsx
import { Modal, Tag, Space, Typography } from "antd";

const { Text } = Typography;

const DIFF_MAP = {
  EASY: { color: "success", label: "Dễ" },
  MEDIUM: { color: "warning", label: "Trung bình" },
  HARD: { color: "error", label: "Khó" },
};
const CAT_COLORS = {
  Java: "green",
  Spring: "cyan",
  SQL: "blue",
  HTML: "orange",
  JavaScript: "magenta",
};
const ALL_QUESTIONS = [
  {
    id: 1,
    content: "What is Java?",
    difficulty: "EASY",
    category: "Java",
    answers: [
      { content: "Programming Language", isCorrect: true },
      { content: "Database", isCorrect: false },
      { content: "Operating System", isCorrect: false },
      { content: "Web Browser", isCorrect: false },
    ],
  },
  {
    id: 2,
    content: "Explain OOP principles",
    difficulty: "MEDIUM",
    category: "Java",
    answers: [
      {
        content: "Encapsulation, Inheritance, Polymorphism, Abstraction",
        isCorrect: true,
      },
      { content: "Compilation only", isCorrect: false },
      { content: "Indexing", isCorrect: false },
      { content: "None of the above", isCorrect: false },
    ],
  },
  {
    id: 3,
    content: "What is Spring Boot?",
    difficulty: "EASY",
    category: "Spring",
    answers: [
      { content: "Java Framework", isCorrect: false },
      { content: "Spring Boot Framework", isCorrect: true },
      { content: "Database Tool", isCorrect: false },
      { content: "Programming Language", isCorrect: false },
    ],
  },
  {
    id: 4,
    content: "What is Primary Key?",
    difficulty: "EASY",
    category: "SQL",
    answers: [
      { content: "Unique identifier", isCorrect: true },
      { content: "Allows duplicate", isCorrect: false },
      { content: "Can be null", isCorrect: false },
      { content: "Optional field", isCorrect: false },
    ],
  },
  {
    id: 5,
    content: "What is HTML?",
    difficulty: "EASY",
    category: "HTML",
    answers: [
      { content: "Programming Language", isCorrect: false },
      { content: "Markup Language", isCorrect: true },
      { content: "Database System", isCorrect: false },
      { content: "Operating System", isCorrect: false },
    ],
  },
];

export default function ExamPreviewModal({ exam, onClose }) {
  if (!exam) return null;
  const questions = ALL_QUESTIONS.filter((q) =>
    exam.questionIds.includes(q.id),
  );

  return (
    <Modal
      title={
        <>
          <Text strong>{exam.title}</Text>
          <Space style={{ marginLeft: 12 }}>
            <Tag color={CAT_COLORS[exam.category]}>{exam.category}</Tag>
            <Tag>{exam.duration} phút</Tag>
            <Tag>{questions.length} câu hỏi</Tag>
          </Space>
        </>
      }
      open={!!exam}
      onCancel={onClose}
      footer={null}
      width={620}
    >
      {questions.length === 0 ? (
        <Text type="secondary">Chưa có câu hỏi nào</Text>
      ) : (
        questions.map((q, idx) => {
          const d = DIFF_MAP[q.difficulty];
          return (
            <div
              key={q.id}
              style={{
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom:
                  idx < questions.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <Space align="start" style={{ marginBottom: 8 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#666",
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <Text strong style={{ fontSize: 14 }}>
                    {q.content}
                  </Text>
                  <br />
                  <Tag color={d.color} style={{ marginTop: 4 }}>
                    {d.label}
                  </Tag>
                </div>
              </Space>
              <div
                style={{
                  paddingLeft: 36,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {q.answers.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: a.isCorrect ? "#f6ffed" : "#fafafa",
                      border: `1px solid ${a.isCorrect ? "#b7eb8f" : "#f0f0f0"}`,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: a.isCorrect ? "#52c41a" : "#e8e8e8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: a.isCorrect ? "#fff" : "#888",
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <Text
                      style={{
                        color: a.isCorrect ? "#389e0d" : "#444",
                        fontWeight: a.isCorrect ? 500 : 400,
                      }}
                    >
                      {a.content}
                    </Text>
                    {a.isCorrect && (
                      <Text
                        type="success"
                        style={{ marginLeft: "auto", fontSize: 11 }}
                      >
                        ✓ Đúng
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </Modal>
  );
}
