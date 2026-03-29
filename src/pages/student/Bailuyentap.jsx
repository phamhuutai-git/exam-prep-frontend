import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Tag, Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getExamsByClass } from "../../services/student/studentServices";
import { useAuth } from "../../context/AuthContext"; // 🔥 thêm



const Bailuyentap = () => {
  const [liked, setLiked] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth(); // 🔥 lấy user từ context

  // format duration
  const formatDuration = (time) => {
    if (!time) return "N/A";
    const [h, m] = time.split(":");
    return parseInt(h) > 0
      ? `${parseInt(h)} giờ ${parseInt(m)} phút`
      : `${parseInt(m)} phút`;
  };

  useEffect(() => {
    const loadData = () => {
      const saved = JSON.parse(localStorage.getItem("favoriteExams")) || {};
      setLiked(saved);
    };

    const fetchData = async () => {
      try {
        const classId = user?.classId;

        // 🔥 tránh gọi khi chưa có user
        if (!classId) {
          console.log("Chưa có classId");
          return;
        }

        const res = await getExamsByClass(classId);

        const rawData = res.data?.data?.content || [];

        const mappedData = rawData.map((item) => ({
          id: item.id,
          title: item.title,
          subject: item.category,
          duration: formatDuration(item.duration),
          questions: item.questions,
        }));

        setExams(mappedData);
      } catch (err) {
        console.error("Lỗi API:", err);
      }
    };

    loadData();

    if (user) {
      fetchData(); // 🔥 chỉ gọi khi có user
    }

    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, [user]); // 🔥 thêm user

  const filteredData = useMemo(() => {
  return exams.filter(
    (exam) =>
      !searchTerm ||
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [searchTerm, exams]);

  const toggleLike = (exam) => {
    const newLiked = {
      ...liked,
      [exam.id]: !liked[exam.id],
    };

    setLiked(newLiked);
    localStorage.setItem("favoriteExams", JSON.stringify(newLiked));
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
                >
                  Luyện tập
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Bailuyentap;