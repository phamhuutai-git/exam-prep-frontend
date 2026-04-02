import React, { useState, useMemo, useEffect } from "react";
import { Card, Tag, Input, Typography, Row, Col, Progress, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faClock,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import View from "../../components/student/LichSuThi/View";
import { getAttemptsByExamType } from "../../services/student/studentServices";

const LichSuluyentap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAttemptsByExamType("PRACTICE", {
          page: 0,
          size: 10,
          sort: ["id,desc"],
        });
        const raw = res?.data?.data?.content || res?.data?.content || [];

        const mapped = raw.map((item) => {
          const total =
            (item.correctCount ?? 0) +
            (item.wrongCount ?? 0) +
            (item.blankCount ?? 0);

          const isSubmitted = item.status === "SUBMITTED";
          const isPass = (item.score ?? 0) >= 5;

          return {
            id: item.id,
            title: item.exam?.title || "Không có tiêu đề",
            date: item.startTime
              ? new Date(item.startTime).toLocaleDateString("vi-VN")
              : "N/A",
            duration: item.exam?.duration || "0",
            type: item.exam?.examType === "OFFICIAL" ? "Thi thật" : "Luyện tập",
            score: item.score ?? 0,
            correct: item.correctCount ?? 0,
            wrong: item.wrongCount ?? 0,
            total,
            timeDone: `${item.timeSpentSeconds ?? 0}s`,
            status: isPass ? "ĐẠT" : "KHÔNG ĐẠT",
            isSubmitted,
            isPass,
            rawData: item,
          };
        });

        setHistoryData(mapped);
      } catch (err) {
        console.error("Lỗi API:", err);
        setHistoryData([]);
      }
    };

    fetchData();
  }, []);

  const filteredHistory = useMemo(() => {
    return historyData.filter((item) =>
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, historyData]);

  return (
    <div style={{ padding: "24px" }}>
    <h1>Lịch sử thi luyện tập</h1>
      <p style={{ marginBottom: "32px", color: "#666" }}>
        Xem lại lịch sử thi luyện tập của bạn
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

export default LichSuluyentap;
