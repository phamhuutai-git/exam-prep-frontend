import React, { useState, useRef } from "react";
import { Card, Row, Col, Radio, Button, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { confirm } = Modal;

const Thithu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examData = location.state;

  const questionRefs = useRef({});
  const rightPanelRef = useRef(null);

  const [startTime] = useState(new Date());
  const [submitDuration, setSubmitDuration] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // ✅ Nếu reload bị mất state
  if (!examData) {
    return (
      <div style={{ padding: "24px" }}>
        <h3>Không có dữ liệu bài thi</h3>
        <Button onClick={() => navigate("/student/bai-thi")}>
          Quay lại
        </Button>
      </div>
    );
  }

  // ✅ Map API → UI
 const questions = examData.questions.map((q) => ({
    id: q.id,
    question: q.content,
    correct: q.correctAnswerId, // Add correct answer ID
    explanation: q.explanation || '', // Add explanation
    options: q.answers.map((a, i) => ({
      key: a.id,
      label: String.fromCharCode(65 + i),
      content: a.content,
    })),
  }));

  const handleChange = (qId, value) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: value });
  };

  const handleConfirmSubmit = () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) score++;
    });

    setSubmitted(true);
    setResult(score);

    const endTime = new Date();
    const diffMs = endTime - startTime;

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    setSubmitDuration(`${minutes} phút ${seconds} giây`);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.id]).length;

    if (unanswered === 0) {
      confirm({
        title: "Xác nhận nộp bài",
        content:
          "Bạn đã làm hết tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài không?",
        okText: "Nộp bài",
        cancelText: "Hủy",
        onOk() {
          handleConfirmSubmit();
        },
      });
      return;
    }

    confirm({
      title: "Xác nhận nộp bài",
      content: `Hiện còn ${unanswered} câu chưa làm, bạn có muốn nộp bài không?`,
      okText: "Nộp bài",
      cancelText: "Hủy",
      onOk() {
        handleConfirmSubmit();
      },
    });
  };

  const handleGoBacks = () => {
    navigate("/student/bai-thi-luyen-tap");
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
          <h2>{examData.examTitle}</h2>
          <p style={{ color: "#666" }}>Đọc kỹ đề bài và chọn đáp án</p>
        </Col>

        <Col style={{ textAlign: "right" }}>
          <p>Thời gian làm bài</p>
          <h3>{examData.duration || "N/A"}</h3>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          {questions.map((q) => {
            const isCorrect = submitted && answers[q.id] === q.correct;

            return (
              <div key={q.id} ref={(el) => (questionRefs.current[q.id] = el)}>
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
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    value={answers[q.id]}
                    disabled={submitted}
                  >
                    {q.options.map((opt) => {
                      const value = opt.label;
                      let color = "black";

                      if (submitted) {
                        if (value === q.correct) color = "#52c41a";
                        else if (answers[q.id] === value) color = "#ff4d4f";
                      }

                      return (
                        <div key={opt.key} style={{ marginBottom: "8px" }}>
                          <Radio value={value}>
                            <span style={{ color }}>{opt.label}. {opt.content}</span>
                          </Radio>
                        </div>
                      );
                    })}
                  </Radio.Group>

                  {submitted && (
                    <p style={{ marginTop: "10px", color: "#555" }}>
                      <b>Giải thích:</b> {q.explanation}
                    </p>
                  )}
                </Card>
              </div>
            );
          })}
        </Col>

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
            <p>Xem nhanh</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {questions.map((q) => {
                const isCorrect = submitted && answers[q.id] === q.correct;

                return (
                  <Button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id)}
                    style={{
                      background: submitted
                        ? answers[q.id]
                          ? isCorrect
                            ? "#52c41a"
                            : "#ff4d4f"
                          : undefined
                        : answers[q.id]
                        ? "#1677ff"
                        : undefined,
                      color: answers[q.id] ? "#fff" : undefined,
                    }}
                  >
                    {q.id}
                  </Button>
                );
              })}
            </div>

            <Button
              type="primary"
              block
              onClick={handleSubmit}
              disabled={submitted}
              style={{ marginBottom: "10px" }}
            >
              Nộp bài
            </Button>

            {submitted && (
              <Button block onClick={handleGoBacks}>
                Quay lại danh sách thi
              </Button>
            )}
          </div>
        </Col>
      </Row>

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
        <p><b>Tên bài thi:</b> {examData.examTitle}</p>
        <p><b>Thời gian:</b> {examData.duration}</p>
        <p><b>Thời gian nộp:</b> {submitDuration}</p>

        <p>
          <b>Trạng thái:</b>{" "}
          <span
            style={{
              color:
                result / questions.length >= 0.5 ? "#52c41a" : "#ff4d4f",
            }}
          >
            {result / questions.length >= 0.5 ? "ĐẠT" : "KHÔNG ĐẠT"}
          </span>
        </p>

        <hr />

        <h3>Kết quả</h3>
        <p>
          <b>Điểm:</b>{" "}
          {((result / questions.length) * 10).toFixed(1)}/10
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