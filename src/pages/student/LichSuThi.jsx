import React, { useState, useMemo } from "react";
import { Card, Tag, Input, Typography, Row, Col, Progress, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faClock,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import View from "../../components/student/LichSuThi/View";
const mockHistoryData = [
  {
    id: "LS001",
    title: "Toán 12 - Chương 1",
    date: "14/05/2024",
    duration: "45 phút",
    type: "Thi thật",
    score: 8.5,
    correct: 42,
    total: 50,
    wrong: 8,
    timeDone: "32m",
    status: "ĐẠT",

    questions: [
      {
        question: "Cho hàm số y = f(x)...",
        selected: 0, // ✅ đúng
        answers: [
          { text: "A. Đồng biến trên (0;2)", correct: true },
          { text: "B. Nghịch biến trên (0;2)", correct: false },
          { text: "C. Đồng biến trên (-∞;0)", correct: false },
          { text: "D. Không xác định", correct: false },
        ],
      },
      {
        question: "Đạo hàm của y = x^2 là?",
        selected: 2, // ❌ sai
        answers: [
          { text: "A. 2x", correct: true },
          { text: "B. x", correct: false },
          { text: "C. x^2", correct: false },
        ],
      },
    ],
  },

  {
    id: "LS002",
    title: "Toán 12 - Chương 2",
    date: "15/05/2024",
    duration: "45 phút",
    type: "Luyện tập",
    score: 7.5,
    correct: 38,
    total: 50,
    wrong: 12,
    timeDone: "30m",
    status: "ĐẠT",

    questions: [
      {
        question: "Tìm đạo hàm của hàm số y = x³",
        selected: 1, // ❌ sai
        answers: [
          { text: "A. 3x²", correct: true },
          { text: "B. x²", correct: false },
          { text: "C. 2x", correct: false },
          { text: "D. 3x", correct: false },
        ],
      },
      {
        question: "Hàm số y = x² đồng biến trên khoảng nào?",
        selected: 1, // ✅ đúng
        answers: [
          { text: "A. (-∞;0)", correct: false },
          { text: "B. (0;+∞)", correct: true },
          { text: "C. (-∞;+∞)", correct: false },
        ],
      },
    ],
  },

  {
    id: "LS003",
    title: "Toán 12 - Chương 3",
    date: "16/05/2024",
    duration: "60 phút",
    type: "Thi thật",
    score: 6.0,
    correct: 30,
    total: 50,
    wrong: 20,
    timeDone: "50m",
    status: "CHƯA ĐẠT",

    questions: [
      {
        question: "Tính nguyên hàm của ∫x dx",
        selected: 1, // ❌ sai
        answers: [
          { text: "A. x²/2 + C", correct: true },
          { text: "B. x² + C", correct: false },
          { text: "C. 2x + C", correct: false },
        ],
      },
      {
        question: "∫1 dx bằng bao nhiêu?",
        selected: 0, // ✅ đúng
        answers: [
          { text: "A. x + C", correct: true },
          { text: "B. 1 + C", correct: false },
        ],
      },
    ],
  },

  {
    id: "LS004",
    title: "Toán 12 - Chương 4",
    date: "17/05/2024",
    duration: "45 phút",
    type: "Luyện tập",
    score: 9.0,
    correct: 45,
    total: 50,
    wrong: 5,
    timeDone: "28m",
    status: "ĐẠT",

    questions: [
      {
        question: "Giải phương trình x² - 4 = 0",
        selected: 0, // ✅ đúng
        answers: [
          { text: "A. x = ±2", correct: true },
          { text: "B. x = 2", correct: false },
          { text: "C. x = -2", correct: false },
        ],
      },
      {
        question: "Giá trị của x trong phương trình x + 2 = 5 là?",
        selected: 2, // ❌ sai
        answers: [
          { text: "A. 3", correct: true },
          { text: "B. 2", correct: false },
          { text: "C. 5", correct: false },
        ],
      },
    ],
  },
];

const LichSuThi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
const [selectedExam, setSelectedExam] = useState(null);

  const filteredHistory = useMemo(() => {
    return mockHistoryData.filter((item) =>
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div style={{ padding: "24px" }}>
    <h1>Danh sách bài thi</h1>
      <p style={{ marginBottom: "32px", color: "#666" }}>
        Chọn bài thi để bắt đầu luyện tập
      </p>

      {/* SEARCH */}
<div style={{ marginBottom: '24px' }}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm bài thi theo tiêu đề, môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* 4 CARD / 1 HÀNG */}
      <Row gutter={[16, 24]} justify="center">
        {filteredHistory.map((exam, index) => (
          <Col 
            xs={24} 
            sm={12} 
            md={8} 
            lg={6} 
            key={exam.id}
            style={{ opacity: 0, animation: `fadeInUp 0.6s ease forwards ${index * 0.1 + 0.2}s` }}
          >
            <Card
              hoverable
              style={{
                borderRadius: 16,
                height: "100%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
            >
              {/* TITLE + STATUS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: `2px solid ${exam.status === "ĐẠT" ? '#52c41a' : '#f5222d'}`,
                }}
              >
                <Typography.Text strong style={{ fontSize: 16, color: '#1f2937' }}>
                  {exam.title}
                </Typography.Text>
                <Tag 
                  style={{
                    fontWeight: 'bold',
                    borderRadius: 20,
                    padding: '4px 12px',
                    animation: exam.status === "ĐẠT" ? 'pulse 2s infinite' : 'none',
                  }} 
                  color={exam.status === "ĐẠT" ? "#52c41a" : "#f5222d"}
                >
                  {exam.status}
                </Tag>
              </div>

              {/* INFO */}
              <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ color: '#667eea' }} />
                  <span>{exam.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: '#667eea' }} />
                  <span>{exam.duration} - {exam.type}</span>
                </div>
              </div>

              {/* STATS */}
              <div style={{ fontSize: 13 }}>
                <div style={{ marginBottom: 12 }}>
                  Điểm: 
                  <Progress 
                    percent={exam.score * 10} 
                    size="small" 
                    status="active"
                    strokeColor={{
                      '0%': '#f5222d',
                      '50%': '#faad14',
                      '100%': '#52c41a',
                    }}
                    style={{ marginTop: 4, marginBottom: 8 }}
                  />
                  <b style={{ color: exam.score >= 7 ? '#52c41a' : exam.score >= 5 ? '#faad14' : '#f5222d' }}>{exam.score}/10</b>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Badge status={exam.correct / exam.total > 0.8 ? "success" : "default"} />
                  <span>Đúng: <strong>{exam.correct}/{exam.total}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, color: '#f5222d' }}>
                  <Badge status="error" text={exam.wrong} />
                  Sai
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge status="processing" text={exam.timeDone} />
                  Thời gian nộp
                </div>
              </div>

              {/* BUTTON */}
              <div style={{ marginTop: 12 }}>
  <button
  onClick={() => {
    setSelectedExam(exam);
    setOpenModal(true);
  }}
  style={{
    width: "100%",
    padding: "10px 16px",
    borderRadius: 25,
    border: "none",
    background: "linear-gradient(135deg, #1677ff 0%, #1e3a8a 100%)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(22, 119, 255, 0.4)",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 8px 25px rgba(22, 119, 255, 0.6)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 15px rgba(22, 119, 255, 0.4)";
  }}
>
  Xem chi tiết →
</button>
</div>
            </Card>
          </Col>
        ))}
      </Row>
      <View
      open={openModal}
      onClose={() => setOpenModal(false)}
      data={selectedExam}
    />
    </div>
    
  );
};

const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(82, 196, 26, 0); }
  100% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default LichSuThi;
