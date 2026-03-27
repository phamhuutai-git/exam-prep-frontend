import React, { useState, useRef } from "react";
import { Card, Row, Col, Radio, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const Thithu = () => {
  const questionRefs = useRef({});
  const rightPanelRef = useRef(null);
  const navigate = useNavigate();
  const [startTime] = useState(new Date()); // thời điểm bắt đầu
const [submitDuration, setSubmitDuration] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const questions = [
  {
    id: 1,
    question: "Nguyên hàm của x là gì?",
    options: ["A. x²", "B. x²/2 + C", "C. 2x", "D. ln x"],
    correct: "B",
    explanation: "Áp dụng công thức ∫x dx = x²/2 + C",
  },
  {
    id: 2,
    question: "Đạo hàm của x² là gì?",
    options: ["A. x", "B. 2x", "C. x²", "D. 2"],
    correct: "B",
    explanation: "Áp dụng (x^n)' = n*x^(n-1) → (x²)' = 2x",
  },

  // Các câu tính toán
  {
    id: 3,
    question: "1 + 1 = ?",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correct: "B",
    explanation: "1 + 1 = 2",
  },
  {
    id: 4,
    question: "2 + 3 = ?",
    options: ["A. 4", "B. 5", "C. 6", "D. 3"],
    correct: "B",
    explanation: "2 + 3 = 5",
  },
  {
    id: 5,
    question: "5 - 2 = ?",
    options: ["A. 2", "B. 3", "C. 4", "D. 1"],
    correct: "B",
    explanation: "5 - 2 = 3",
  },
  {
    id: 6,
    question: "3 + 4 = ?",
    options: ["A. 6", "B. 7", "C. 8", "D. 5"],
    correct: "B",
    explanation: "3 + 4 = 7",
  },
  {
    id: 7,
    question: "6 - 1 = ?",
    options: ["A. 4", "B. 5", "C. 6", "D. 3"],
    correct: "B",
    explanation: "6 - 1 = 5",
  },
  {
    id: 8,
    question: "2 + 2 = ?",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correct: "B",
    explanation: "2 + 2 = 4",
  },
  {
    id: 9,
    question: "7 - 3 = ?",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correct: "B",
    explanation: "7 - 3 = 4",
  },
  {
    id: 10,
    question: "4 + 5 = ?",
    options: ["A. 8", "B. 9", "C. 7", "D. 6"],
    correct: "B",
    explanation: "4 + 5 = 9",
  },
  {
    id: 11,
    question: "9 - 4 = ?",
    options: ["A. 4", "B. 5", "C. 6", "D. 3"],
    correct: "B",
    explanation: "9 - 4 = 5",
  },
  {
    id: 12,
    question: "3 + 3 = ?",
    options: ["A. 5", "B. 6", "C. 7", "D. 4"],
    correct: "B",
    explanation: "3 + 3 = 6",
  },
  {
    id: 13,
    question: "8 - 2 = ?",
    options: ["A. 5", "B. 6", "C. 7", "D. 4"],
    correct: "B",
    explanation: "8 - 2 = 6",
  },
  {
    id: 14,
    question: "1 + 5 = ?",
    options: ["A. 5", "B. 6", "C. 7", "D. 4"],
    correct: "B",
    explanation: "1 + 5 = 6",
  },
  {
    id: 15,
    question: "6 - 3 = ?",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correct: "B",
    explanation: "6 - 3 = 3",
  },
  {
    id: 16,
    question: "2 + 6 = ?",
    options: ["A. 7", "B. 8", "C. 6", "D. 5"],
    correct: "B",
    explanation: "2 + 6 = 8",
  },
  {
    id: 17,
    question: "10 - 5 = ?",
    options: ["A. 4", "B. 5", "C. 6", "D. 3"],
    correct: "B",
    explanation: "10 - 5 = 5",
  },
  {
    id: 18,
    question: "4 + 4 = ?",
    options: ["A. 6", "B. 8", "C. 7", "D. 5"],
    correct: "B",
    explanation: "4 + 4 = 8",
  },
  {
    id: 19,
    question: "7 - 2 = ?",
    options: ["A. 4", "B. 5", "C. 6", "D. 3"],
    correct: "B",
    explanation: "7 - 2 = 5",
  },
  {
    id: 20,
    question: "5 + 3 = ?",
    options: ["A. 7", "B. 8", "C. 6", "D. 5"],
    correct: "B",
    explanation: "5 + 3 = 8",
  },
  {
    id: 21,
    question: "9 - 3 = ?",
    options: ["A. 5", "B. 6", "C. 7", "D. 4"],
    correct: "B",
    explanation: "9 - 3 = 6",
  },
  {
    id: 22,
    question: "2 + 7 = ?",
    options: ["A. 8", "B. 9", "C. 7", "D. 6"],
    correct: "B",
    explanation: "2 + 7 = 9",
  },
  {
    id: 23,
    question: "8 - 4 = ?",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correct: "B",
    explanation: "8 - 4 = 4",
  },
  {
    id: 24,
    question: "3 + 5 = ?",
    options: ["A. 7", "B. 8", "C. 6", "D. 5"],
    correct: "B",
    explanation: "3 + 5 = 8",
  },
  {
    id: 25,
    question: "6 - 2 = ?",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correct: "B",
    explanation: "6 - 2 = 4",
  },
  {
    id: 26,
    question: "1 + 8 = ?",
    options: ["A. 8", "B. 9", "C. 7", "D. 6"],
    correct: "B",
    explanation: "1 + 8 = 9",
  },
  {
    id: 27,
    question: "10 - 3 = ?",
    options: ["A. 6", "B. 7", "C. 8", "D. 5"],
    correct: "B",
    explanation: "10 - 3 = 7",
  },
  {
    id: 28,
    question: "4 + 6 = ?",
    options: ["A. 9", "B. 10", "C. 8", "D. 7"],
    correct: "B",
    explanation: "4 + 6 = 10",
  },
  {
    id: 29,
    question: "7 - 1 = ?",
    options: ["A. 5", "B. 6", "C. 7", "D. 4"],
    correct: "B",
    explanation: "7 - 1 = 6",
  },
  {
    id: 30,
    question: "5 + 5 = ?",
    options: ["A. 9", "B. 10", "C. 8", "D. 7"],
    correct: "B",
    explanation: "5 + 5 = 10",
  },
];

  const handleChange = (qId, value) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [qId]: value,
    });
  };

const handleSubmit = () => {
  let score = 0;

  questions.forEach((q) => {
    if (answers[q.id] === q.correct) score++;
  });

  setSubmitted(true);
  setResult(score);

  // 🔥 tính thời gian làm bài
  const endTime = new Date();
  const diffMs = endTime - startTime;

  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  setSubmitDuration(`${minutes} phút ${seconds} giây`);

  setOpenModal(true);
};

  const handleGoBack = () => {
    navigate("/student/bai-thi");
  };

  const scrollToQuestion = (id) => {
    setActiveQuestion(id);
    questionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Row justify="space-between" style={{ marginBottom: "24px" }}>
        <Col>
          <h2>Toán lớp 12 - Chương 1</h2>
          <p style={{ color: "#666" }}>Đọc kỹ đề bài và chọn đáp án</p>
        </Col>

        <Col style={{ textAlign: "right" }}>
          <p>Thời gian làm bài</p>
          <h3>01:28:30</h3>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* LEFT */}
        <Col span={16}>
          {questions.map((q) => {
            const isCorrect =
              submitted && answers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                ref={(el) => (questionRefs.current[q.id] = el)}
              >
                <Card
                  title={`Câu ${q.id}`}
                  style={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    border: submitted
                      ? answers[q.id]
                        ? isCorrect
                          ? "2px solid #52c41a"
                          : "2px solid #ff4d4f"
                        : "1px solid #f0f0f0"
                      : activeQuestion === q.id
                      ? "2px solid #1677ff"
                      : "1px solid #f0f0f0",
                  }}
                >
                  <p>{q.question}</p>

                  <Radio.Group
  onChange={(e) =>
    handleChange(q.id, e.target.value)
  }
  value={answers[q.id]}
  disabled={submitted || answers[q.id]} // 🔥 THÊM DÒNG NÀY
>
                    {q.options.map((opt, index) => {
                      const value = opt.charAt(0);

                      let color = "black";

                      if (submitted) {
                        if (value === q.correct) {
                          color = "#52c41a";
                        } else if (answers[q.id] === value) {
                          color = "#ff4d4f";
                        }
                      }

                      return (
                        <div key={index} style={{ marginBottom: "8px" }}>
                          <Radio value={value}>
                            <span style={{ color }}>{opt}</span>
                          </Radio>
                        </div>
                      );
                    })}
                  </Radio.Group>

                  {/* 🔥 HIỂN THỊ NGAY KHI CHỌN */}
                  {answers[q.id] && !submitted && (
                    <div style={{ marginTop: "10px" }}>
                      {answers[q.id] === q.correct ? (
                        <p style={{ color: "#52c41a" }}>✔ Đúng</p>
                      ) : (
                        <p style={{ color: "#ff4d4f" }}>
                          ✘ Sai - Đáp án đúng: {q.correct}
                        </p>
                      )}

                      <p style={{ fontStyle: "italic", color: "#555" }}>
                        <b>Giải thích:</b> {q.explanation}
                      </p>
                    </div>
                  )}

                  {/* 🔥 SAU KHI NỘP */}
                  {submitted && (
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ fontStyle: "italic", color: "#555" }}>
                        <b>Giải thích:</b> {q.explanation}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </Col>

        {/* RIGHT */}
        <Col span={8}>
          <div
            ref={rightPanelRef}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "12px",
              position: "sticky",
              top: "20px",
            }}
          >
            <Button
              type="primary"
              block
              onClick={handleSubmit}
              disabled={submitted}
              style={{ marginBottom: "20px" }}
            >
              Nộp bài
            </Button>

            {submitted && (
              <Button
                block
                onClick={handleGoBack}
                style={{ marginBottom: "20px" }}
              >
                Quay lại danh sách thi
              </Button>
            )}

            <p>Xem lại nhanh</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
              }}
            >
              {questions.map((q) => {
                const isCorrect =
                  submitted && answers[q.id] === q.correct;

                return (
                  <Button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id)}
                   style={{
  background: submitted
    ? answers[q.id]
      ? isCorrect
        ? "#52c41a" // 🟢 đúng
        : "#ff4d4f" // 🔴 sai
      : undefined
    : answers[q.id]
    ? "#1677ff" // 🔵 đã chọn
    : undefined, // ⚪ chưa chọn

  color:
    submitted
      ? answers[q.id]
        ? "#fff"
        : undefined
      : answers[q.id]
      ? "#fff"
      : undefined,
}}
                  >
                    {q.id}
                  </Button>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* MODAL */}
      <Modal
  title="Kết quả bài thi"
  open={openModal}
  onCancel={() => setOpenModal(false)}
  footer={[
    <Button key="review" type="primary" onClick={() => setOpenModal(false)}>
      Xem lại bài
    </Button>,
  ]}
>
  {/* Thông tin chung */}
  <p><b>Ngày thi:</b> 14/05/2024</p>
  <p><b>Thời gian:</b> 45 phút</p>
  <p><b>Loại thi:</b> Luyện tập</p>
<p><b>Thời gian nộp:</b> {submitDuration}</p>

  <p>
    <b>Trạng thái:</b>{" "}
    <span style={{ color: result / questions.length >= 0.5 ? "#52c41a" : "#ff4d4f" }}>
      {result / questions.length >= 0.5 ? "ĐẠT" : "KHÔNG ĐẠT"}
    </span>
  </p>

  <hr />

  {/* Kết quả */}
  <h3>Kết quả</h3>

  <p>
    <b>Điểm số:</b> {((result / questions.length) * 10).toFixed(1)}/10
  </p>

  <p>
    <b>Đúng:</b> {result}/{questions.length}
  </p>

  <p>
    <b>Sai:</b> {questions.length - result}
  </p>
</Modal>
    </div>
  );
};

export default Thithu;