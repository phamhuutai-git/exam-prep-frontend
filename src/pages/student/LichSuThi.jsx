import React, { useState, useMemo, useEffect } from "react";
import { Card, Tag, Input, Typography, Row, Col, Progress, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import View from "../../components/student/LichSuThi/View";
import { getAttemptsByExamType } from "../../services/student/studentServices";

const LichSuThi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAttemptsByExamType("OFFICIAL", {
          page: 0,
          size: 10,
          sort: ["id,desc"],
        });
        const raw =
          res?.data?.data?.content || res?.data?.content || [];
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

            type:
              item.exam?.examType === "OFFICIAL"
                ? "Thi thật"
                : "Luyện tập",

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
    return historyData.filter(
      (item) =>
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, historyData]);

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
     

      {/* LIST */}
      <Row gutter={[16, 24]}>
        {filteredHistory.map((exam) => (
          <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
            <Card hoverable style={{ borderRadius: 16 }}>
              
              {/* TITLE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  borderBottom: `2px solid ${exam.status === "ĐẠT" ? "#52c41a" : "#f5222d"}`,
                }}
              >
                <Typography.Text strong>
                  {exam.title}
                </Typography.Text>

                <Tag
                  color={exam.status === "ĐẠT" ? "green" : "red"}
                >
                  {exam.status}
                </Tag>
              </div>

              {/* INFO */}
              <div style={{ fontSize: 13, marginBottom: 12 }}>
                <div>
                  <FontAwesomeIcon icon={faCalendar} /> {exam.date}
                </div>
                <div>
                  <FontAwesomeIcon icon={faClock} /> {exam.duration} - {exam.type}
                </div>
              </div>

              {/* SCORE */}
              <div>
                <Progress percent={exam.score * 10} size="small" />
                <b>{exam.score}/10</b>
              </div>

              {/* STATS */}
              <div style={{ marginTop: 10 }}>
                <div>
                  <Badge
                    status={
                      exam.total > 0 && exam.correct / exam.total > 0.8
                        ? "success"
                        : "default"
                    }
                  />
                  Đúng: {exam.correct}/{exam.total}
                </div>

                <div style={{ color: "red" }}>
                  Sai: {exam.wrong}
                </div>

                <div>Thời gian: {exam.timeDone}</div>
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

      {/* MODAL */}
      <View
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedExam}
      />
    </div>
  );
};

export default LichSuThi;