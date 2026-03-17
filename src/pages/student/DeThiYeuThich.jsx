import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag } from "antd";
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

const DeThiYeuThich = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("favoriteExams")) || {};

    const favList = mockData.filter((exam) => liked[exam.id]);

    setFavorites(favList);
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Đề thi yêu thích</h1>
      <p>Danh sách các đề thi bạn đã lưu.</p>

      {favorites.length === 0 ? (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: "white",
            borderRadius: 8,
          }}
        >
          
        </div>
      ) : (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {favorites.map((exam) => (
            <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 20,
                    color: "hotpink",
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
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DeThiYeuThich;