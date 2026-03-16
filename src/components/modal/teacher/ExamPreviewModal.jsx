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

export default function ExamPreviewModal({ exam, onClose }) {
  if (!exam) return null;

  const questions = exam?.questions || [];

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
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
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
                {(q.answers || []).map((a, i) => (
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
