import React, { useState, useEffect, useMemo } from "react";
<<<<<<< HEAD
import { Card, Row, Col, Tag, Button, Select, Input, InputNumber, Space, Spin, Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/StudentExam.css";
import examService from "../../services/examService";

const { Option } = Select;
=======
import { Card, Row, Col, Tag, Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBook, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
>>>>>>> a7abd600ff27425f8409b4545005591696aef189

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

const STORAGE_KEY = "student_exams_v1";

const BaiThi = () => {
<<<<<<< HEAD
  const [exams, setExams] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : mockData;
    } catch {
      return mockData;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favoriteExams")) || {};
    } catch {
      return {};
    }
  });

  const [selectedClass, setSelectedClass] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("favoriteExams", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let mounted = true;
    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const payload =
          selectedClass === "all"
            ? await examService.getAllExams()
            : await examService.getExamsByClass(selectedClass);

        const result = Array.isArray(payload) ? payload : payload?.data || payload?.exams || [];

        if (!mounted) return;
        setExams(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Failed loading exams:", err);
        if (!mounted) return;
        setError("Không thể tải dữ liệu từ server. Đang dùng dữ liệu cục bộ.");
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setExams(raw ? JSON.parse(raw) : mockData);
        } catch {
          setExams(mockData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchExams();
    return () => {
      mounted = false;
    };

  }, [selectedClass]);

  const classes = useMemo(() => {
    const list = Array.isArray(exams) ? exams : [];
    const set = new Set(list.map((e) => e.class || e.className).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [exams]);

  const filtered = useMemo(() => {
    const list = Array.isArray(exams) ? exams : [];
    return selectedClass === "all" ? list : list.filter((e) => (e.class || e.className) === selectedClass);
  }, [exams, selectedClass]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEdit = (exam) => {
    setEditingId(exam.id);
    setEditValues({ title: exam.title, questions: exam.questions, duration: exam.duration });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = (id) => {
    setExams((prev) => (Array.isArray(prev) ? prev.map((e) => (e.id === id ? { ...e, ...editValues } : e)) : prev));
    cancelEdit();
  };

  return (
    <div className="student-exam-page">
      <header className="exam-header">
        <div>
          <h1>Danh sách đề thi (Học viên)</h1>
          <p className="muted">Lọc theo lớp và chỉnh sửa nhanh tiêu đề/số câu/duration.</p>
        </div>

        <div className="controls">
          <label className="control-label">Lớp:</label>
          <Select value={selectedClass} onChange={setSelectedClass} style={{ width: 160 }}>
            {classes.map((c) => (
              <Option key={c} value={c}>
                {c === "all" ? "Tất cả lớp" : c}
              </Option>
            ))}
          </Select>
        </div>
      </header>
=======
  const [liked, setLiked] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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
>>>>>>> a7abd600ff27425f8409b4545005591696aef189

      {error && (
        <div style={{ marginBottom: 12 }}>
          <Alert type="warning" message={error} />
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && (
        <Row gutter={[24, 24]}>
          {filtered.map((exam) => (
            <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
              <Card hoverable className="exam-card">
                <FontAwesomeIcon
                  icon={faHeart}
                  onClick={() => toggleFavorite(exam.id)}
                  className={favorites[exam.id] ? "fav active" : "fav"}
                />

                {editingId === exam.id ? (
                  <div className="edit-block">
                    <Input
                      value={editValues.title}
                      onChange={(e) => setEditValues((s) => ({ ...s, title: e.target.value }))}
                      style={{ marginBottom: 8 }}
                    />
                    <Space>
                      <InputNumber
                        min={1}
                        value={editValues.questions}
                        onChange={(v) => setEditValues((s) => ({ ...s, questions: v }))}
                      />
                      <Input
                        value={editValues.duration}
                        onChange={(e) => setEditValues((s) => ({ ...s, duration: e.target.value }))}
                      />
                    </Space>

<<<<<<< HEAD
                    <div className="edit-actions">
                      <Button onClick={() => saveEdit(exam.id)} type="primary">
                        Lưu
                      </Button>
                      <Button onClick={cancelEdit}>Hủy</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="exam-title">{exam.title}</h3>
                    <p className="muted small">
                      <FontAwesomeIcon icon={faBook} /> {exam.questions} câu
                    </p>
                    <Tag color="blue">{exam.subject}</Tag>
                    <p className="muted small">
                      <FontAwesomeIcon icon={faClock} /> {exam.duration}
                    </p>

                    <div className="card-actions">
                      <Button onClick={() => startEdit(exam)}>Sửa nhanh</Button>
                      <Button type="primary">Làm bài</Button>
                    </div>
                  </>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
=======
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                <Button>Thi thử</Button>
                <Button type="primary">Thi</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
>>>>>>> a7abd600ff27425f8409b4545005591696aef189
    </div>
  );
};

export default BaiThi;
