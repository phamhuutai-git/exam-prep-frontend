import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Radio, Button, Modal } from "antd";
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  submitExam,
  resolveAttemptId,
  getReviewExam,
} from "../../services/student/studentServices";
import { useNavigate, useLocation } from "react-router-dom";

const { confirm } = Modal;

// --- COMPONENT ĐỒNG HỒ CHẠY TRONG MODAL XÁC NHẬN ---
const LiveTimer = ({ initialTime, formatTime }) => {
  const [seconds, setSeconds] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <strong style={{ fontSize: "18px" }}>{formatTime(seconds)}</strong>;
};

// --- HELPER FUNCTIONS ---
const explanationFromRawAnswer = (a) => {
  if (!a || typeof a !== "object") return "";
  const v = a.explanation ?? a.explain ?? a.answerExplanation ?? a.feedback ?? a.hint ?? a.description;
  return v != null ? String(v).trim() : "";
};

const normalizeReviewPayload = (axiosRes) => {
  const root = axiosRes?.data?.data ?? axiosRes?.data;
  if (!root) return {};
  const list = Array.isArray(root) ? root : root.questions ?? root.questionDetails ?? root.details ?? root.content ?? [];
  const map = {};
  for (const item of list) {
    const qid = item.questionId ?? item.question?.id ?? item.id;
    if (qid == null) continue;
    const key = Number(qid);
    const correctOptionId = item.correctOptionId ?? item.correctAnswerId ?? item.correctOption?.id;
    map[key] = {
      isCorrect: Boolean(item.isCorrect ?? item.correct),
      correctOptionId: correctOptionId != null ? Number(correctOptionId) : undefined,
      explanation: (item.explanation ?? item.explain ?? item.note ?? "").trim(),
      selectedOptionId: item.selectedOptionId != null ? Number(item.selectedOptionId) : item.selectedAnswerId != null ? Number(item.selectedAnswerId) : undefined,
    };
  }
  return map;
};

const getReviewForQuestion = (reviewByQuestionId, qid) =>
    reviewByQuestionId[qid] ?? reviewByQuestionId[Number(qid)] ?? reviewByQuestionId[String(qid)];

const getExplanationForSelection = (q, selectedAnswerId) => {
  if (selectedAnswerId == null || selectedAnswerId === "") return null;
  const sel = q.options.find((o) => String(o.value) === String(selectedAnswerId));
  const correct = q.options.find((o) => o.isCorrect);
  const text = (sel?.explanation || "").trim() || (correct?.explanation || "").trim() || (q.questionExplanation || "").trim();
  return text || null;
};

// 🔥 ĐÃ SỬA: Hàm này giờ xử lý được cả Integer (phút) và String (00:00:00)
const parseDurationToSeconds = (duration) => {
  if (!duration) return 0;

  // Trường hợp backend gửi số phút (Integer)
  if (typeof duration === 'number') {
    return duration * 60;
  }

  // Trường hợp backend gửi chuỗi thời gian (String cũ)
  if (typeof duration === 'string' && duration.includes(':')) {
    const parts = duration.split(':');
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
  }
  return 0;
};

// --- MAIN COMPONENT ---
const Thithu = () => {
  const questionRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const examData = location.state;

  const [timeLeft, setTimeLeft] = useState(examData ? parseDurationToSeconds(examData.duration) : 0);
  const [startTime] = useState(new Date());
  const [submitDuration, setSubmitDuration] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reviewByQuestionId, setReviewByQuestionId] = useState({});
  const [studentName, setStudentName] = useState("Thí sinh");

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        const first = (userObj.firstName || "").trim();
        const last = (userObj.lastName || "").trim();
        const rawName = userObj.fullName || `${first} ${last}`.trim();

        if (rawName) {
          const formattedName = rawName
              .toLowerCase()
              .split(' ')
              .filter(word => word !== "")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          setStudentName(formattedName);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      }
    }
  }, []);

  const formatTime = (seconds) => {
    if (seconds <= 0 || isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleConfirmSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const endTime = new Date();
    const diffMs = endTime - startTime;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    let durationString = "";
    if (minutes > 0) durationString += `${minutes} phút `;
    durationString += `${seconds} giây`;
    setSubmitDuration(durationString);

    try {
      const answerList = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId: Number(questionId),
        selectedOptionId: answerId,
      }));

      const attemptId = resolveAttemptId(examData);
      if (attemptId == null) {
        alert("Thiếu mã lượt thi. Vui lòng vào lại từ danh sách.");
        setSubmitted(false);
        return;
      }

      const res = await submitExam(attemptId, answerList, examData.examType);
      setResult(res.data?.data ?? res.data);

      try {
        const reviewRes = await getReviewExam(attemptId);
        setReviewByQuestionId(normalizeReviewPayload(reviewRes));
      } catch (error) {
        console.error("Lỗi review:", error);
        setReviewByQuestionId({});
      }
      setOpenModal(true);
    } catch (error) {
      console.error("Lỗi nộp bài:", error);
      setSubmitted(false);
    }
  };

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      const autoSubmitTimer = setTimeout(() => handleConfirmSubmit(), 0);
      return () => clearTimeout(autoSubmitTimer);
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted]);

  if (!examData) return <div style={{ padding: 24 }}>Không có dữ liệu bài thi</div>;

  const questions = examData.questions.map((q) => ({
    id: q.id,
    question: q.content,
    questionExplanation: (q.explanation ?? q.explain ?? q.questionExplanation ?? q.hint ?? "").trim(),
    options: q.answers.map((a, i) => ({
      label: String.fromCharCode(65 + i),
      value: a.id,
      text: a.content ?? a.text ?? "",
      explanation: explanationFromRawAnswer(a),
      isCorrect: Boolean(a.correct ?? a.isCorrect ?? a.isRight ?? a.answerCorrect),
    })),
  }));

  const handleChange = (qId, value) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.id]).length;

    confirm({
      title: (
          <div style={{ fontSize: "20px", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#52c41a", fontSize: "28px" }}>📋</span>
            Bạn có chắc chắn muốn nộp bài ?
          </div>
      ),
      icon: null,
      content: (
          <div style={{ marginTop: "20px", fontSize: "16px", color: "#333", lineHeight: "1.6" }}>
            <div style={{ marginBottom: "16px" }}>
              Thời gian làm bài của bạn còn: <LiveTimer initialTime={timeLeft} formatTime={formatTime} />
            </div>

            {unanswered > 0 ? (
                <div style={{ color: "#d4380d", marginBottom: "16px", fontWeight: "500", fontSize: "16px" }}>
                  Cảnh báo: Bạn còn {unanswered} câu hỏi trắc nghiệm chưa trả lời. Bạn có chắc muốn kết thúc bài thi?
                </div>
            ) : (
                <div style={{ color: "#52c41a", marginBottom: "16px", fontWeight: "500", fontSize: "16px" }}>
                  Tuyệt vời: Bạn đã hoàn thành tất cả các câu hỏi. Bạn có chắc muốn kết thúc bài thi?
                </div>
            )}

            <div style={{ color: "#666", fontSize: "14px", borderTop: "1px solid #e8e8e8", paddingTop: "16px" }}>
              Khi xác nhận nhấn nộp bài, bạn sẽ không thể sửa lại bài thi của mình. Hãy chắc chắn bạn đã xem lại tất cả các đáp án. Chúc bạn may mắn!
            </div>
          </div>
      ),
      okText: "Nộp bài",
      cancelText: "Hủy",
      okButtonProps: { size: "large", style: { background: "#253b9f", borderColor: "#253b9f", width: "120px", fontWeight: "bold" } },
      cancelButtonProps: { size: "large", style: { background: "#f0f2f5", color: "#666", border: "none", width: "120px", fontWeight: "bold" } },
      width: 600,
      centered: true,
      zIndex: 9999,
      onOk() { handleConfirmSubmit(); },
    });
  };

  const handleGoBack = () => {
    if (!submitted) {
      confirm({
        title: "Thoát bài luyện tập?",
        content: "Tiến trình làm bài sẽ không được lưu. Bạn có chắc chắn muốn thoát?",
        okText: "Thoát",
        cancelText: "Ở lại",
        zIndex: 9999,
        onOk() { navigate("/student/bai-thi-luyen-tap"); }
      });
    } else {
      navigate("/student/bai-thi-luyen-tap");
    }
  };

  const scrollToQuestion = (id) => {
    setActiveQuestion(id);
    const el = questionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", flexDirection: "column" }}>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#fff", padding: "12px 24px", borderBottom: "1px solid #e8e8e8",
          position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <Button onClick={handleGoBack} style={{ borderRadius: 20 }}>&lt; Quay lại</Button>
          <div style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
            Thí sinh: {studentName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
             <span style={{ fontWeight: "bold", fontSize: "16px", color: timeLeft <= 60 ? "red" : "#333" }}>
               ⏱ {formatTime(timeLeft)}
             </span>
            <Button type="primary" onClick={handleSubmit} disabled={submitted} style={{ borderRadius: 20 }}>
              Nộp bài
            </Button>
          </div>
        </div>

        <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <Row gutter={24}>
            <Col span={16}>
              {questions.map((q, index) => {
                const selectedId = answers[q.id];
                const rev = getReviewForQuestion(reviewByQuestionId, q.id);
                const correctOpt = q.options.find((o) => o.isCorrect);
                const correctId = correctOpt?.value;
                const answered = selectedId != null && selectedId !== "";
                const isCorrect = answered && correctId != null && String(selectedId) === String(correctId);

                let borderStyle = "1px solid #e8e8e8";
                if (submitted && rev) {
                  borderStyle = rev.isCorrect ? "2px solid #52c41a" : "2px solid #ff4d4f";
                } else if (!submitted && answered && correctId != null) {
                  borderStyle = isCorrect ? "2px solid #52c41a" : "2px solid #ff4d4f";
                } else if (activeQuestion === q.id) {
                  borderStyle = "2px solid #1677ff";
                }

                const explanationText = submitted && rev?.explanation ? rev.explanation : getExplanationForSelection(q, selectedId);

                return (
                    <div key={q.id} ref={(el) => (questionRefs.current[q.id] = el)}>
                      <Card
                          style={{ marginBottom: "20px", borderRadius: "8px", border: borderStyle }}
                          styles={{ body: { padding: '24px' } }}
                      >
                        <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "15px" }}>Câu {index + 1}:</div>
                        <div style={{ marginBottom: "20px", fontSize: "15px" }}>{q.question}</div>

                        <Radio.Group
                            onChange={(e) => handleChange(q.id, e.target.value)}
                            value={answers[q.id]}
                            disabled={submitted}
                            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}
                        >
                          {q.options.map((opt) => {
                            let color = "inherit", optBorder = "1px solid #d9d9d9", optBg = "#fff";

                            if (submitted && rev) {
                              if (rev.correctOptionId != null && String(opt.value) === String(rev.correctOptionId)) {
                                color = "#52c41a"; optBorder = "1px solid #52c41a"; optBg = "#f6ffed";
                              } else if (selectedId != null && String(opt.value) === String(selectedId) && !rev.isCorrect) {
                                color = "#ff4d4f"; optBorder = "1px solid #ff4d4f"; optBg = "#fff2f0";
                              }
                            } else if (String(opt.value) === String(selectedId)) {
                              optBorder = "1px solid #1677ff"; optBg = "#e6f4ff";
                            }

                            return (
                                <div key={opt.value} style={{ padding: "10px 16px", border: optBorder, borderRadius: "8px", background: optBg }}>
                                  <Radio value={opt.value}>
                                    <span style={{ color, fontSize: "15px" }}><strong>{opt.label}.</strong> {opt.text}</span>
                                  </Radio>
                                </div>
                            );
                          })}
                        </Radio.Group>

                        {explanationText && (
                            <div style={{ marginTop: 16, padding: "12px", background: "#f9f9f9", borderRadius: "8px", borderLeft: "4px solid #1677ff" }}>
                              <b style={{ color: "#1677ff" }}>Giải thích:</b> <span style={{ marginLeft: "8px", color: "#555" }}>{explanationText}</span>
                            </div>
                        )}
                      </Card>
                    </div>
                );
              })}
            </Col>

            <Col span={8}>
              <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", position: "sticky", top: "90px", border: "1px solid #e8e8e8" }}>
                <div style={{ fontWeight: "bold", marginBottom: "16px", fontSize: "15px" }}>Danh sách câu hỏi</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "24px" }}>
                  {questions.map((q, index) => {
                    const selectedId = answers[q.id];
                    const rev = getReviewForQuestion(reviewByQuestionId, q.id);
                    const answered = selectedId != null && selectedId !== "";

                    let bg = "#fff", color = "#333", border = "1px solid #d9d9d9";

                    if (submitted && rev) {
                      bg = rev.isCorrect ? "#52c41a" : "#ff4d4f"; color = "#fff"; border = "none";
                    } else if (answered) {
                      bg = "#1677ff"; color = "#fff"; border = "none";
                    }

                    return (
                        <Button key={q.id} onClick={() => scrollToQuestion(q.id)} style={{ background: bg, color: color, border: border, borderRadius: "4px" }}>
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </Button>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>

          <Modal
              open={openModal}
              closable={false}
              footer={null}
              centered
              width={500}
              zIndex={10000}
              styles={{ body: { padding: '32px 24px' } }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', color: '#1f1f1f' }}>
                Bài làm của bạn đã được gửi đi
              </h2>

              <div style={{ fontSize: '16px', marginBottom: '24px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Điểm của bạn:</span>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f1f1f', marginLeft: '12px' }}>
                  {result ? (result.score).toFixed(1) : 0}/10
                </span>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '24px 0' }}></div>

              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', marginBottom: '24px' }}>
                {examData.examTitle}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', color: '#333', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}><UserOutlined style={{ marginRight: '8px' }}/> Thí sinh</span>
                  <strong style={{ color: '#1f1f1f' }}>{studentName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}><ClockCircleOutlined style={{ marginRight: '8px' }}/> Thời gian làm bài</span>
                  <strong style={{ color: '#1f1f1f' }}>{submitDuration}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}><CheckCircleOutlined style={{ marginRight: '8px' }}/> Số câu trắc nghiệm đúng</span>
                  <strong style={{ color: '#1f1f1f' }}>{result?.correctCount}/{result?.totalQuestions}</strong>
                </div>
              </div>

              <Button
                  type="default" size="large" block
                  style={{ marginTop: '32px', borderRadius: '8px', height: '46px', fontSize: '16px', fontWeight: '500', color: '#253b9f', borderColor: '#253b9f' }}
                  onClick={() => setOpenModal(false)}
              >
                Xem lại bài &gt;
              </Button>
            </div>
          </Modal>

        </div>
      </div>
  );
};

export default Thithu;