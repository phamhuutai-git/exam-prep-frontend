import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Radio, Button, Modal } from "antd";
import {
  submitExam,
  resolveAttemptId,
  getReviewExam,
} from "../../services/student/studentServices";
import { useNavigate, useLocation } from "react-router-dom";
const { confirm } = Modal;
/** Gom text giải thích từ một object đáp án gốc (backend có thể đặt tên khác nhau). */
const explanationFromRawAnswer = (a) => {
  if (!a || typeof a !== "object") return "";
  const v =
    a.explanation ??
    a.explain ??
    a.answerExplanation ??
    a.feedback ??
    a.hint ??
    a.description;
  return v != null ? String(v).trim() : "";
};

/** Map GET .../review-detail → { [questionId]: { isCorrect, correctOptionId, explanation, ... } } */
const normalizeReviewPayload = (axiosRes) => {
  const root = axiosRes?.data?.data ?? axiosRes?.data;
  if (!root) return {};

  const list = Array.isArray(root)
    ? root
    : root.questions ??
    root.questionDetails ??
    root.details ??
    root.content ??
    [];

  const map = {};
  for (const item of list) {
    const qid = item.questionId ?? item.question?.id ?? item.id;
    if (qid == null) continue;
    const key = Number(qid);
    const correctOptionId =
      item.correctOptionId ??
      item.correctAnswerId ??
      item.correctOption?.id;
    map[key] = {
      isCorrect: Boolean(item.isCorrect ?? item.correct),
      correctOptionId:
        correctOptionId != null ? Number(correctOptionId) : undefined,
      explanation: (item.explanation ?? item.explain ?? item.note ?? "").trim(),
      selectedOptionId:
        item.selectedOptionId != null
          ? Number(item.selectedOptionId)
          : item.selectedAnswerId != null
            ? Number(item.selectedAnswerId)
            : undefined,
    };
  }
  return map;
};

const getReviewForQuestion = (reviewByQuestionId, qid) =>
  reviewByQuestionId[qid] ??
  reviewByQuestionId[Number(qid)] ??
  reviewByQuestionId[String(qid)];

/** Giải thích chỉ khi đã chọn đáp án cho đúng câu đó: đáp án chọn → đáp án đúng → giải thích cấp câu hỏi. */
const getExplanationForSelection = (q, selectedAnswerId) => {
  if (selectedAnswerId == null || selectedAnswerId === "") return null;
  const sel = q.options.find(
    (o) => String(o.value) === String(selectedAnswerId)
  );
  const correct = q.options.find((o) => o.isCorrect);
  const fromSel = (sel?.explanation || "").trim();
  const fromCorrect = (correct?.explanation || "").trim();
  const fromQ = (q.questionExplanation || "").trim();
  const text = fromSel || fromCorrect || fromQ;
  return text || null;
};

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
const Thithu = () => {
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
  /** Sau nộp bài: chi tiết từ getReviewExam (đúng/sai + giải thích server) */
  const [reviewByQuestionId, setReviewByQuestionId] = useState({});

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
  const questions = examData.questions.map((q) => ({
    id: q.id,
    question: q.content,
    questionExplanation: (
      q.explanation ??
      q.explain ??
      q.questionExplanation ??
      q.hint ??
      ""
    ).trim(),
    options: q.answers.map((a, i) => ({
      label: String.fromCharCode(65 + i),
      value: a.id,
      text: a.content ?? a.text ?? "",
      explanation: explanationFromRawAnswer(a),
      isCorrect: Boolean(
        a.correct ?? a.isCorrect ?? a.isRight ?? a.answerCorrect
      ),
    })),
  }));
  const handleChange = (qId, value) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };


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
        alert("Thiếu mã lượt thi. Vui lòng vào lại từ danh sách bài luyện tập.");
        setSubmitted(false);
        return;
      }

      const res = await submitExam(attemptId, answerList, examData.examType);
      const resultPayload = res.data?.data ?? res.data;
      setResult(resultPayload);

      try {
        const reviewRes = await getReviewExam(attemptId);
        setReviewByQuestionId(normalizeReviewPayload(reviewRes));
      } catch (reviewErr) {
        console.error("getReviewExam:", reviewErr);
        setReviewByQuestionId({});
      }

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
    navigate("/student/bai-thi-luyen-tap");
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
        <Col span={16}>
          {questions.map((q, index) => {
            const selectedId = answers[q.id];
            const rev = getReviewForQuestion(reviewByQuestionId, q.id);
            const correctOpt = q.options.find((o) => o.isCorrect);
            const correctId = correctOpt?.value;
            const answered =
              selectedId != null && selectedId !== "";
            const isCorrect =
              answered &&
              correctId != null &&
              String(selectedId) === String(correctId);

            let borderStyle = "1px solid #f0f0f0";
            if (submitted && rev) {
              borderStyle = rev.isCorrect
                ? "2px solid #52c41a"
                : "2px solid #ff4d4f";
            } else if (!submitted && answered && correctId != null) {
              borderStyle = isCorrect
                ? "2px solid #52c41a"
                : "2px solid #ff4d4f";
            } else if (activeQuestion === q.id) {
              borderStyle = "2px solid #1677ff";
            }

            const explanationText =
              submitted && rev?.explanation
                ? rev.explanation
                : getExplanationForSelection(q, selectedId);

            return (
              <div key={q.id} ref={(el) => (questionRefs.current[q.id] = el)}>
                <Card
                  title={`Câu ${index + 1}`}
                  style={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    border: borderStyle,
                  }}
                >
                  <p>{q.question}</p>

                  <Radio.Group
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    value={answers[q.id]}
                    disabled={submitted}
                  >
                    {q.options.map((opt) => {
                      let color = "inherit";
                      if (submitted && rev) {
                        const oid = String(opt.value);
                        if (
                          rev.correctOptionId != null &&
                          oid === String(rev.correctOptionId)
                        ) {
                          color = "#52c41a";
                        } else if (
                          selectedId != null &&
                          oid === String(selectedId) &&
                          !rev.isCorrect
                        ) {
                          color = "#ff4d4f";
                        }
                      } else if (!submitted && answered && correctId != null) {
                        const oid = String(opt.value);
                        if (oid === String(correctId)) color = "#52c41a";
                        else if (oid === String(selectedId)) color = "#ff4d4f";
                      }
                      return (
                        <div key={opt.value} style={{ marginBottom: "8px" }}>
                          <Radio value={opt.value}>
                            <span style={{ color }}>
                              {opt.label}. {opt.text}
                            </span>
                          </Radio>
                        </div>
                      );
                    })}
                  </Radio.Group>

                  {explanationText ? (
                    <p
                      style={{
                        marginTop: 12,
                        fontStyle: "italic",
                        color: "#555",
                      }}
                    >
                      <b>Giải thích:</b> {explanationText}
                    </p>
                  ) : null}
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
    top: "90px",
    maxHeight: "80vh",
    overflowY: "auto",
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
              {questions.map((q, index) => {
                const selectedId = answers[q.id];
                const rev = getReviewForQuestion(reviewByQuestionId, q.id);
                const correctOpt = q.options.find((o) => o.isCorrect);
                const correctId = correctOpt?.value;
                const answered =
                  selectedId != null && selectedId !== "";
                const ok =
                  answered &&
                  correctId != null &&
                  String(selectedId) === String(correctId);

                let bg;
                if (submitted && rev) {
                  bg = rev.isCorrect ? "#52c41a" : "#ff4d4f";
                } else if (!submitted && answered && correctId != null) {
                  bg = ok ? "#52c41a" : "#ff4d4f";
                } else if (answered) {
                  bg = "#1677ff";
                }

                return (
                  <Button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id)}
                    style={{
                      background: bg,
                      color: answered ? "#fff" : undefined,
                    }}
                  >
                    {index + 1}
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
          <Button key="review" type="primary" onClick={() => setOpenModal(false)}>
            Xem lại bài
          </Button>,
          // <Button key="finish" type="primary" onClick={handleGoBack}>
          //   Kết thúc
          // </Button>
        ]}
      >
        <p><b>Ngày thi:</b> {formatDate(startTime)}</p>

        <p>
          <b>Thời gian:</b> {examData.duration}
        </p>

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
        <p>
          <b>Đúng:</b> {result?.correctCount}/{result?.totalQuestions}
        </p>
        <p>
          <b>Sai:</b> {result?.wrongCount}
        </p>
        <p>
          <b>Chưa làm:</b> {result?.blankCount}
        </p>
      </Modal>
    </div>
  );
};

export default Thithu;