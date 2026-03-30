import React, { useState, useRef } from "react";
import { Card, Row, Col, Radio, Button, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { confirm } = Modal;

const Thithat = () => {
  const [startTime] = useState(new Date());
  const [submitDuration, setSubmitDuration] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [, setResult] = useState(0); // ✅ fix unused var
  const [openModal, setOpenModal] = useState(false);

  const questionRefs = useRef({});
  const rightPanelRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const examData = location.state;

  // ✅ tránh crash khi F5
  if (!examData) {
    return <p>Không có dữ liệu bài thi</p>;
  }

  // ✅ convert API → UI
  const questions = examData.questions.map((q) => ({
    id: q.id,
    question: q.content,
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
        content: "Bạn đã làm hết tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài không?",
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
      content: `Hiện còn ${unanswered} câu hỏi chưa được làm, bạn có muốn nộp bài không?`,
      okText: "Nộp bài",
      cancelText: "Hủy",
      onOk() {
        handleConfirmSubmit();
      },
    });
  };

  const handleGoBack = () => {
    navigate("/student/bai-thi");
  };

  const scrollToQuestion = (index) => {
    setActiveQuestion(index);
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Row justify="space-between" style={{ marginBottom: "24px" }}>
        <Col>
          <h2>{examData.examTitle}</h2>
          <p style={{ color: "#666" }}>
            Đọc kỹ đề bài và chọn đáp án
          </p>
        </Col>

        <Col style={{ textAlign: "right" }}>
          <p>Thời gian làm bài</p>
          <h3>{examData.duration}</h3>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* LEFT */}
        <Col span={16}>
          {questions.map((q, index) => {
            return (
              <div
                key={q.id}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <Card
                  title={`Câu ${index + 1}`}
                  style={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    border:
                      activeQuestion === index
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
                    disabled={submitted}
                  >
                    {q.options.map((opt, i) => (
                      <div key={i} style={{ marginBottom: "8px" }}>
                        <Radio value={opt.key}>
                          {opt.label}. {opt.content}
                        </Radio>
                      </div>
                    ))}
                  </Radio.Group>
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
            <p style={{ marginBottom: "10px" }}>Xem lại nhanh</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {questions.map((q, index) => (
                <Button
                  key={q.id}
                  onClick={() => scrollToQuestion(index)}
                  style={{
                    background: answers[q.id] ? "#1677ff" : undefined,
                    color: answers[q.id] ? "#fff" : undefined,
                  }}
                >
                  {index + 1}
                </Button>
              ))}
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
              <Button block onClick={handleGoBack}>
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
          <Button
            key="review"
            type="primary"
            onClick={() => setOpenModal(false)}
          >
            Xem lại bài
          </Button>,
        ]}
      >
        <p><b>Ngày thi:</b> 14/05/2024</p>
        <p><b>Thời gian:</b> {examData.duration}</p>
        <p><b>Loại thi:</b> Thi thật</p>
        <p><b>Thời gian nộp:</b> {submitDuration}</p>

        <p>
          <b>Trạng thái:</b>{" "}
          <span style={{ color: "#52c41a" }}>
            ĐÃ NỘP
          </span>
        </p>

        <hr />

        <h3>Kết quả</h3>
        <p><b>Điểm số:</b> --/10</p>
        <p><b>Đúng:</b> --</p>
        <p><b>Sai:</b> --</p>
      </Modal>
    </div>
  );
};

export default Thithat;