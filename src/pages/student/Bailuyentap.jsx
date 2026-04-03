import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Tag, Button, Input, Spin, Empty, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  getExamsByClass,
  startExam,
  resolveAttemptId,
  restartExam
} from "../../services/student/studentServices";
import { useAuth } from "../../context/AuthContext";

const Bailuyentap = () => {
  const [liked, setLiked] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(false); // 🔥 loading
  const [error, setError] = useState(null); // 🔥 error

  const navigate = useNavigate();
  const { user } = useAuth();

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
        setLoading(true);
        setError(null);

        const classId = user?.classId;

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
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (user) {
      fetchData();
    }

    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
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
  const handleStartExam = async (examId) => {
    try {
      setLoading(true);

      const res = await startExam(examId);

      const data = res.data?.data;

      if (!data) {
        throw new Error("Không có dữ liệu bài thi");
      }

      const attemptId = resolveAttemptId(data);
      if (attemptId == null) {
        throw new Error("API start không trả về attemptId");
      }

      // 👉 Map dữ liệu giống Thithat đang dùng (cần attemptId để nộp bài)
      const examData = {
        attemptId,
        examTitle: data.examTitle,
        duration: data.duration,
        questions: data.questions,
        examType: data.examType,
      };

      // 👉 Navigate to practice exam page
      navigate(`/student/thithu/${examId}`, {
        state: examData,
      });

    } catch (err) {
      console.error("Lỗi start exam:", err);

      // 🔥 xử lý case đã thi dở
      if (
        err.response?.data?.message?.includes("ongoing attempt")
      ) {
        alert("Bạn đang có bài thi chưa nộp!");
      } else {
        alert("Không thể bắt đầu bài thi");
      }
    } finally {
      setLoading(false);
    }
  };

  //Them function restart thi
  const handleRestartExam = (examId) => {
    Modal.confirm({
      title: "Xác nhận làm lại bài luyện tập",
      content: "Bạn sẽ mất kết quả hiện tại. Bạn có chắc muốn làm lại?",
      okText: "Làm lại",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);

          const res = await restartExam(examId);
          const data = res.data?.data;

          if (!data) {
            throw new Error("Không có dữ liệu bài thi");
          }

          const attemptId = resolveAttemptId(data);
          if (attemptId == null) {
            throw new Error("API restart không trả về attemptId");
          }

          // Map dữ liệu giống Thithat đang dùng (cần attemptId để nộp bài)
          const examData = {
            attemptId,
            examTitle: data.examTitle,
            duration: data.duration,
            questions: data.questions,
            examType: data.examType,
          };

          // 👉 Navigate to practice exam page
          navigate(`/student/thithu/${examId}`, {
            state: examData,
          });

          console.log(data);
        } catch (err) {
          console.error(err);
          alert("Không thể làm lại bài luyện tập");
        }
      }
    })
  }


  return (
    <div style={{ padding: "24px" }}>
      <h1>Danh sách bài thi luyện tập</h1>
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

      {/* LOADING */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        /* ERROR */
        <div style={{ textAlign: "center", color: "red", marginTop: 50 }}>
          {error}
        </div>
      ) : filteredData.length === 0 ? (
        /* EMPTY */
        <div style={{ marginTop: 50 }}>
          <Empty description="Không có bài thi" />
        </div>
      ) : (
        /* DATA */
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <Button
                    type="primary"
                    onClick={() => handleStartExam(exam.id)}
                  >
                    Luyện tập
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
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Bailuyentap;