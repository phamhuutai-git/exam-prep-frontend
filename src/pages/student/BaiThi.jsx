import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Tag, Button, Input, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getExamsByClassOfficial, startExam, restartExam } from "../../services/student/studentServices"; // ✅ thêm startExam
import { useAuth } from "../../context/AuthContext";
const BaiThi = () => {
  const [liked, setLiked] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  // ✅ THÊM FUNCTION NÀY
  const handleStartExam = async (examId) => {
    try {
      const res = await startExam(examId);
      const data = res.data?.data;
      navigate(`/student/thi/${examId}`, {
        state: data,
      });
      console.log(data);
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg?.includes("ongoing attempt")) {
        alert("Bạn đang có bài thi chưa nộp!");
      } else {
        alert(msg || "Không thể bắt đầu bài thi");
      }
    }
  };

  //Them function restart thi
  const handleRestartExam = (examId) => {
    Modal.confirm({
      title: "Xác nhận làm lại bài thi",
      content: "Bạn sẽ mất kết quả hiện tại. Bạn có chắc muốn làm lại?",
      okText: "Làm lại",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await restartExam(examId);
          const data = res.data?.data;

          navigate(`/student/thi/${examId}`, {
            state: data,
          });
          console.log(data);
        } catch (err) {
          console.error(err);
          alert("Không thể làm lại bài thi");
        }
      }
    })
  }

  const formatDuration = (time) => {
    if (!time) return "N/A";
    const [h, m] = time.split(":");
    return parseInt(h) > 0
      ? `${parseInt(h)} giờ ${parseInt(m)} phút`
      : `${parseInt(m)} phút`;
  };

  useEffect(() => {
    const loadLiked = () => {
      const saved = JSON.parse(localStorage.getItem("favoriteExams")) || {};
      setLiked(saved);
    };

    const fetchData = async () => {
      try {
        const classId = user?.classId;

        if (!classId) {
          console.log("Chưa có classId");
          return;
        }

        setLoading(true);

        const res = await getExamsByClassOfficial(classId);
        const rawData = res.data?.data?.content || [];

        const mapped = rawData.map((item) => ({
          id: item.id,
          title: item.title,
          subject: item.category,
          duration: formatDuration(item.duration),
          questions: item.questions,
        }));

        setExams(mapped);
      } catch (err) {
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLiked();

    if (user) {
      fetchData();
    }

    window.addEventListener("storage", loadLiked);
    return () => {
      window.removeEventListener("storage", loadLiked);
    };
  }, [user]);

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
      <h1>Danh sách bài thi thật</h1>
      <p style={{ marginBottom: "32px", color: "#666" }}>
        Chọn bài thi để bắt đầu thi
      </p>

      <div style={{ marginBottom: "24px" }}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm bài thi theo tiêu đề, môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải...</p>
      ) : filteredData.length === 0 ? (
        <p style={{ textAlign: "center" }}>Không có bài thi</p>
      ) : (
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

                {/* ✅ CHỈ SỬA CHỖ NÀY */}
                <Button
                  type="primary"
                  onClick={() => handleStartExam(exam.id)}
                >
                  Thi
                </Button>

                <Button
                  danger
                  style={{
                    marginLeft: 16,
                    borderRadius: 8,
                    padding: "0 16px",
                    fontWeight: 500,
                  }}
                  onClick={() => handleRestartExam(exam.id)}
                >
                  Làm lại
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BaiThi;