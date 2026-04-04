import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { Card, Row, Col, Radio, Button, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  submitExam,
  resolveAttemptId,
} from "../../services/student/studentServices";

const { confirm } = Modal;

const parseDurationToSeconds = (duration) => {
  if (!duration) return 0;
  const parts = duration.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
};

const Thithat = () => {
  const questionRefs = useRef({});
  const rightPanelRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const examData = location.state;
  const [timeLeft, setTimeLeft] = useState(examData ? parseDurationToSeconds(examData.duration) : 0); // giây
  const [startTime] = useState(new Date());
  const [submitDuration, setSubmitDuration] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (submitted) return; // nếu đã nộp thì dừng

    if (timeLeft <= 0) {
      handleConfirmSubmit(); // ⏰ auto submit
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    if (seconds <= 0 || isNaN(seconds)) {
      return "00:00";
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  // ❌ nếu reload mất data
  if (!examData) {
    return <div style={{ padding: 24 }}>Không có dữ liệu bài thi</div>;
  }

  // ✅ map API → UI (giữ gần giống code cũ)
  const questions = examData.questions.map((q) => ({
    id: q.id,
    question: q.content,
    options: q.answers.map((a, i) => ({
      label: String.fromCharCode(65 + i), // A B C D
      value: a.id, // 👉 QUAN TRỌNG
      text: a.content,
    })),
  }));

  const handleChange = (qId, value) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: value });
  };

  // ✅ submit thật
  const handleConfirmSubmit = async () => {
    if (submitted) return; // ❗ cực quan trọng

    setSubmitted(true);

    const endTime = new Date();
    const diffMs = endTime - startTime;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    setSubmitDuration(`${minutes} phút ${seconds} giây`);

    try {
      const answerList = Object.entries(answers).map(
        ([questionId, answerId]) => ({
          questionId: Number(questionId),
          selectedOptionId: answerId,
        })
      );

      const attemptId = resolveAttemptId(examData);
      if (attemptId == null) {
        alert("Thiếu mã lượt thi. Vui lòng vào lại từ danh sách bài thi.");
        setSubmitted(false);
        return;
      }

      const res = await submitExam(attemptId, answerList);
      console.log(res);

      setResult(res.data); // ✅ đúng
      setOpenModal(true);
    } catch (err) {
      console.error(err);
      setSubmitted(false);
    }
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.id]).length;

    confirm({
      title: "Xác nhận nộp bài",
      content:
        unanswered === 0
          ? "Bạn đã làm hết. Bạn có chắc muốn nộp?"
          : `Còn ${unanswered} câu chưa làm, vẫn nộp?`,
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

  const scrollToQuestion = (id) => {
  setActiveQuestion(id);

  const el = questionRefs.current[id];
  if (!el) return;

  // Scroll bên trái
  el.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  // Scroll bên phải (Xem lại nhanh)
  if (rightPanelRef.current) {
    const container = rightPanelRef.current;

    const elTop = el.getBoundingClientRect().top;
    const containerTop = container.getBoundingClientRect().top;

    const offset = elTop - containerTop;

    container.scrollTo({
      top: container.scrollTop + offset - 100,
      behavior: "smooth",
    });
  }
};
  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN");
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
          <h3 style={{ color: timeLeft <= 60 ? "red" : "black" }}>
            {formatTime(timeLeft)}
          </h3>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* LEFT */}
        <Col span={16}>
          {questions.map((q, index) => (
            <div
              key={`${q.id}-${index}`}
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
                  {q.options.map((opt) => (
                    <div key={opt.value} style={{ marginBottom: "8px" }}>
                      <Radio value={opt.value}>
                        {opt.label}. {opt.text}
                      </Radio>
                    </div>
                  ))}
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
    top: "90px",
    maxHeight: "80vh",
    overflowY: "auto",
  }}
>
            <p>Xem lại nhanh</p>

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
                  key={`question-${q.id}-${index}`}
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
            >
              Nộp bài
            </Button>

            {/* {submitted && (
              // <Button block onClick={handleGoBack}>
              //   Quay lại
              // </Button>
            )} */}
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
                Kết thúc
              </Button>,
            ]}
          >
            <p><b>Ngày thi:</b> {formatDate(startTime)}</p>

            <p><b>Thời gian:</b> {examData.duration} phút</p>

            <p><b>Loại thi:</b> {examData.examType}</p>
            <p><b>Thời gian nộp:</b> {submitDuration}</p>
    
            <p>
  <b>Trạng thái:</b>{" "}
 <span style={{ color: result?.resultStatus === "PASSED" ? "#52c41a" : "#ff4d4f" }}>
  {result?.resultStatus === "PASSED" ? "ĐẠT" : "KHÔNG ĐẠT"}
</span>
</p>

<hr />

<h3>Kết quả</h3>

<p>
 <b>Điểm số:</b>{" "}
{result ? result.score : 0}
</p>

<p><b>Đúng:</b> {result?.correctCount}/{result?.totalQuestions}</p>

<p><b>Sai:</b> {result?.wrongCount}</p>
<p><b>Chưa làm:</b> {result?.blankCount}</p>
          </Modal>
      <Modal
        title="Kết quả bài thi"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={[
          <Button key="finish" type="primary" onClick={handleGoBack}>
            Kết thúc
          </Button>
          
        ]}
      >
        <p><b>Ngày thi:</b> {formatDate(startTime)}</p>

        <p><b>Thời gian:</b> {examData.duration} phút</p>

        <p><b>Loại thi:</b> {examData.examType}</p>
        <p><b>Thời gian nộp:</b> {submitDuration}</p>

        <p>
          <b>Trạng thái:</b>{" "}
          <span style={{ color: result?.resultStatus === "PASSED" ? "#52c41a" : "#ff4d4f" }}>
            {result?.resultStatus === "PASSED" ? "ĐẠT" : "KHÔNG ĐẠT"}
          </span>
        </p>

        <hr />

        <h3>Kết quả</h3>

        <p>
          <b>Điểm số:</b>{" "}
          {result ? (result.score).toFixed(1) : 0}
        </p>

        <p><b>Đúng:</b> {result?.correctCount}/{result?.totalQuestions}</p>

        <p><b>Sai:</b> {result?.wrongCount}</p>
        <p><b>Chưa làm:</b> {result?.blankCount}</p>
      </Modal>
    </div>
  );
};

export default Thithat;