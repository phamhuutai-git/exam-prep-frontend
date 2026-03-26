import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
const mockData = [
  {
    id: "BT001",
    title: "Toán - Chương 1",
    subject: "Toán",
    duration: "60 phút",
    questions: 30,
    class: "12A1",
  },
  {
    id: "BT002",
    title: "Văn - Nghị luận xã hội",
    subject: "Ngữ văn",
    duration: "90 phút",
    questions: 40,
    class: "12A1",
  },
  {
    id: "BT003",
    title: "Lý - Dao động cơ",
    subject: "Vật lý",
    duration: "45 phút",
    questions: 25,
    class: "11B2",
  },
];

const BaiThi = () => {
  const [liked, setLiked] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteExams")) || {};
    setLiked(saved);
  }, []);

  const filteredData = useMemo(() => {
    return mockData.filter(
      (exam) =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

      <Input
        prefix={<FontAwesomeIcon icon={faSearch} />}
        placeholder="Tìm kiếm bài thi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: 400, marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        {filteredData.map((exam) => (
          <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* ❤️ Like */}
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
              <p>{exam.subject}</p>
              <p>{exam.duration}</p>
              <p>{exam.questions} câu</p>

              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                <Button
                type="primary"
                onClick={() => navigate(`/student/thithu/${exam.id}`)}
                >Luyện tập</Button>
               <Button
                  type="primary"
                  onClick={() => navigate(`/student/thi/${exam.id}`)}
                >
                  Thi
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
<<<<<<< HEAD

export default BaiThi;
=======
export default BaiThi;
>>>>>>> 24a97c5 (code api them)
