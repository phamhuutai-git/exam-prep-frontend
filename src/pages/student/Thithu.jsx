import React, { useState, useRef } from "react";
import { Card, Row, Col, Radio, Button } from "antd";

const Thithu = () => {
  const questionRefs = useRef({});
  const rightPanelRef = useRef(null); // ✅ FIX BUG

  const [activeQuestion, setActiveQuestion] = useState(null);

  const questions = [
    {
      id: 1,
      question: "Nguyên hàm của x là gì?",
      options: ["A. x²", "B. x²/2 + C", "C. 2x", "D. ln x"],
      correct: "B",
    },
    {
      id: 2,
      question: "Đạo hàm của x² là gì?",
      options: ["A. x", "B. 2x", "C. x²", "D. 2"],
      correct: "B",
    },
    {
      id: 3,
      question: "1 + 1 = ?",
      options: ["A. 1", "B. 2", "C. 3", "D. 4"],
      correct: "B",
    },
    {
      id: 4,
      question: "2 + 3 = ?",
      options: ["A. 4", "B. 5", "C. 6", "D. 3"],
      correct: "B",
    },
    {
      id: 5,
      question: "5 - 2 = ?",
      options: ["A. 2", "B. 3", "C. 4", "D. 1"],
      correct: "B",
    },
    {
      id: 6,
      question: "3 + 4 = ?",
      options: ["A. 6", "B. 7", "C. 8", "D. 5"],
      correct: "B",
    },
    {
      id: 7,
      question: "6 - 1 = ?",
      options: ["A. 4", "B. 5", "C. 6", "D. 3"],
      correct: "B",
    },
    {
      id: 8,
      question: "2 + 2 = ?",
      options: ["A. 3", "B. 4", "C. 5", "D. 6"],
      correct: "B",
    },
    {
      id: 9,
      question: "7 - 3 = ?",
      options: ["A. 3", "B. 4", "C. 5", "D. 6"],
      correct: "B",
    },
    {
      id: 10,
      question: "4 + 5 = ?",
      options: ["A. 8", "B. 9", "C. 7", "D. 6"],
      correct: "B",
    },
    {
      id: 11,
      question: "9 - 4 = ?",
      options: ["A. 4", "B. 5", "C. 6", "D. 3"],
      correct: "B",
    },
    {
      id: 12,
      question: "3 + 3 = ?",
      options: ["A. 5", "B. 6", "C. 7", "D. 4"],
      correct: "B",
    },
    {
      id: 13,
      question: "8 - 2 = ?",
      options: ["A. 5", "B. 6", "C. 7", "D. 4"],
      correct: "B",
    },
    {
      id: 14,
      question: "1 + 5 = ?",
      options: ["A. 5", "B. 6", "C. 7", "D. 4"],
      correct: "B",
    },
    {
      id: 15,
      question: "6 - 3 = ?",
      options: ["A. 2", "B. 3", "C. 4", "D. 5"],
      correct: "B",
    },
    {
      id: 16,
      question: "2 + 6 = ?",
      options: ["A. 7", "B. 8", "C. 6", "D. 5"],
      correct: "B",
    },
    {
      id: 17,
      question: "10 - 5 = ?",
      options: ["A. 4", "B. 5", "C. 6", "D. 3"],
      correct: "B",
    },
    {
      id: 18,
      question: "4 + 4 = ?",
      options: ["A. 6", "B. 8", "C. 7", "D. 5"],
      correct: "B",
    },
    {
      id: 19,
      question: "7 - 2 = ?",
      options: ["A. 4", "B. 5", "C. 6", "D. 3"],
      correct: "B",
    },
    {
      id: 20,
      question: "5 + 3 = ?",
      options: ["A. 7", "B. 8", "C. 6", "D. 5"],
      correct: "B",
    },
    {
      id: 21,
      question: "9 - 3 = ?",
      options: ["A. 5", "B. 6", "C. 7", "D. 4"],
      correct: "B",
    },
    {
      id: 22,
      question: "2 + 7 = ?",
      options: ["A. 8", "B. 9", "C. 7", "D. 6"],
      correct: "B",
    },
    {
      id: 23,
      question: "8 - 4 = ?",
      options: ["A. 3", "B. 4", "C. 5", "D. 6"],
      correct: "B",
    },
    {
      id: 24,
      question: "3 + 5 = ?",
      options: ["A. 7", "B. 8", "C. 6", "D. 5"],
      correct: "B",
    },
    {
      id: 25,
      question: "6 - 2 = ?",
      options: ["A. 3", "B. 4", "C. 5", "D. 6"],
      correct: "B",
    },
    {
      id: 26,
      question: "1 + 8 = ?",
      options: ["A. 8", "B. 9", "C. 7", "D. 6"],
      correct: "B",
    },
    {
      id: 27,
      question: "10 - 3 = ?",
      options: ["A. 6", "B. 7", "C. 8", "D. 5"],
      correct: "B",
    },
    {
      id: 28,
      question: "4 + 6 = ?",
      options: ["A. 9", "B. 10", "C. 8", "D. 7"],
      correct: "B",
    },
    {
      id: 29,
      question: "7 - 1 = ?",
      options: ["A. 5", "B. 6", "C. 7", "D. 4"],
      correct: "B",
    },
    {
      id: 30,
      question: "5 + 5 = ?",
      options: ["A. 9", "B. 10", "C. 8", "D. 7"],
      correct: "B",
    },
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (qId, value) => {
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
    alert(`Bạn đúng ${score}/${questions.length} câu`);
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
          <p style={{ color: "#666" }}>
            Đọc kỹ đề bài và chọn đáp án
          </p>
        </Col>

        <Col style={{ textAlign: "right" }}>
          <p>Thời gian làm bài</p>
          <h3>01:28:30</h3>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* LEFT */}
        <Col span={16}>
          {questions.map((q) => (
            <div
              key={q.id}
              ref={(el) => (questionRefs.current[q.id] = el)}
            >
              <Card
                title={`Câu ${q.id}`}
                style={{
                  marginBottom: "16px",
                  borderRadius: "12px",
                  border:
                    activeQuestion === q.id
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
                >
                  {q.options.map((opt, index) => {
                    const value = opt.charAt(0);
                    return (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <Radio value={value}>{opt}</Radio>
                      </div>
                    );
                  })}
                </Radio.Group>
              </Card>
            </div>
          ))}
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
              style={{ marginBottom: "20px" }}
            >
              Nộp bài
            </Button>

            <p>Xem lại nhanh</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
              }}
            >
              {questions.map((q) => (
                <Button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  type={answers[q.id] ? "primary" : "default"}
                >
                  {q.id}
                </Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Thithu;