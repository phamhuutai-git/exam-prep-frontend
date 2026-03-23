import React, { useEffect, useState, useMemo } from "react";
import { Card, Row, Col, Tag, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";

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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFavorites = () => {
      const liked = JSON.parse(localStorage.getItem("favoriteExams")) || {};
      const favList = mockData.filter((exam) => liked[exam.id]);
      setFavorites(favList);
    };

    loadFavorites();

    // nghe thay đổi từ BaiThi
    window.addEventListener("storage", loadFavorites);

    return () => {
      window.removeEventListener("storage", loadFavorites);
    };
  }, []);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((exam) =>
      !searchTerm ||
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favorites, searchTerm]);

  const handleRemove = (id) => {
    const liked = JSON.parse(localStorage.getItem("favoriteExams")) || {};

    delete liked[id];

    localStorage.setItem("favoriteExams", JSON.stringify(liked));

    setFavorites((prev) => prev.filter((item) => item.id !== id));

    // báo cho BaiThi update lại icon
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Đề thi yêu thích</h1>
      <p>Danh sách các đề thi bạn đã lưu.</p>

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
      {filteredFavorites.length === 0 ? (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: "white",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <h3>Chưa có đề thi yêu thích ❤️{searchTerm && ' hoặc không khớp tìm kiếm'}</h3>
        </div>
      ) : (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {filteredFavorites.map((exam) => (
            <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                {/* ❤️ Xoá */}
                <FontAwesomeIcon
                  icon={faHeart}
                  onClick={() => handleRemove(exam.id)}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 20,
                    color: "hotpink",
                    cursor: "pointer",
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
