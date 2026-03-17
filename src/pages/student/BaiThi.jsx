import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart } from "@fortawesome/free-solid-svg-icons";

const mockData = [
  {
    id: "BT001",
    title: "Toán lớp 12 - Chương 1",
    subject: "Toán",
    duration: "60 phút",
    questions: 30,
  },
  {
    id: "BT002",
    title: "Văn lớp 12 - Nghị luận xã hội",
    subject: "Ngữ văn",
    duration: "90 phút",
    questions: 40,
  },
  {
    id: "BT003",
    title: "Lý lớp 11 - Dao động cơ",
    subject: "Vật lý",
    duration: "45 phút",
    questions: 25,
  },
];

const BaiThi = () => {
  const [liked, setLiked] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteExams")) || {};
    setLiked(saved);
  }, []);

  const toggleLike = (exam) => {
    const newLiked = {
      ...liked,
      [exam.id]: !liked[exam.id],
    };

    setLiked(newLiked);
    localStorage.setItem("favoriteExams", JSON.stringify(newLiked));
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Danh sách bài thi</h1>
      <p style={{ marginBottom: "32px", color: "#666" }}>
        Chọn bài thi để bắt đầu luyện tập
      </p>

      <Row gutter={[24, 24]}>
        {mockData.map((exam) => (
          <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
            <Card hoverable style={{ borderRadius: 12, position: "relative", textAlign: "center" }}>
              
              <FontAwesomeIcon
                icon={faHeart}
                onClick={() => toggleLike(exam)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 20,
                  cursor: "pointer",
                  color: liked[exam.id] ? "hotpink" : "#ccc",
                }}
              />

              <h3>{exam.title}</h3>

              <p style={{ color: "#888" }}>
                <FontAwesomeIcon icon={faBook} /> {exam.questions} câu hỏi
              </p>

              <Tag color="blue">{exam.subject}</Tag>

              <p>
                <FontAwesomeIcon icon={faClock} /> {exam.duration}
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                <Button>Thi thử</Button>
                <Button type="primary">Thi</Button>
              </div>

            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BaiThi;