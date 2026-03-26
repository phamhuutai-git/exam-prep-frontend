import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Tag, Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      const saved = JSON.parse(localStorage.getItem("favoriteExams")) || {};
      setLiked(saved);
    };

    loadData();

    // lắng nghe thay đổi từ component khác
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const filteredData = useMemo(() => {
    return mockData.filter((exam) =>
      !searchTerm ||
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

    // phát sự kiện để component khác update
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Danh sách bài thi</h1>
      <p style={{ marginBottom: "32px", color: "#666" }}>
        Chọn bài thi để bắt đầu luyện tập
      </p>
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
      <Row gutter={[24, 24]}>
        {filteredData.map((exam) => (
          <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                position: "relative",
                textAlign: "center",
              }}
            >
              {/* ❤️ Icon */}
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
export default BaiThi;
