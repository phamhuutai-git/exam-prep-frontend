import { useEffect, useState, useCallback } from "react";
import { Button, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 1. Thêm import này
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import CreateQuestionModal from "../../components/modal/teacher/Createquestionmodal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal";
import ScoreChart from "../../components/teacher/dashboard/ScoreChart";
import QuickActions from "../../components/teacher/dashboard/QuickActions";
import questionService from "../../services/teacher/questionService";
import dashBoardService from "../../services/teacher/dashboardService";
import examService from "../../services/teacher/examService";

export default function TeacherDashboard() {
  const navigate = useNavigate(); // 2. Khởi tạo navigate
  const [stats, setStats] = useState([]);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openExam, setOpenExam] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  // --- Các hàm fetchStats, fetchQuestions, fetchCategories giữ nguyên ---
  const fetchStats = useCallback(async () => {
    try {
      const res = await dashBoardService.stats();
      const data = res?.data?.data;
      setStats([
        { id: 1, title: "Tổng số đề thi", value: data?.totalExams || 0 },
        { id: 2, title: "Tổng số câu hỏi", value: data?.totalQuestions || 0 },
        { id: 3, title: "Tổng số học sinh", value: data?.totalStudents || 0 },
      ]);
    } catch (e) {
      console.error("Lỗi fetch stats:", e);
      setStats([
        { id: 1, title: "Tổng số đề thi", value: 0 },
        { id: 2, title: "Tổng số câu hỏi", value: 0 },
        { id: 3, title: "Tổng số học sinh", value: 0 },
      ]);
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await questionService.getQuestionsByTeacher({ page: 0, size: 1000 });
      setAllQuestions(res?.data?.data?.content || []);
    } catch (e) {
      console.error("Lỗi fetch questions:", e);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await questionService.getAllCategory();
      setCategories(res?.data?.data?.content || []);
    } catch (e) {
      console.error("Lỗi fetch categories:", e);
    }
  }, []);

  useEffect(() => {
    const initDashboard = async () => {
      await Promise.all([fetchStats(), fetchQuestions(), fetchCategories()]);
    };
    initDashboard();
  }, [fetchStats, fetchQuestions, fetchCategories]);

  const handleCreateQuestionAPI = async (payload) => {
    try {
      const foundCat = categories.find(c =>
          c.name.toLowerCase().includes(payload.category?.toLowerCase())
      ) || categories[0];

      const formattedPayload = {
        content: payload.content,
        difficulty: (payload.difficulty || "MEDIUM").toUpperCase(),
        categoryId: foundCat?.id,
        explanation: payload.explanation || "Giải thích từ AI",
        answers: payload.answers.map((ans, index) => ({
          content: ans.content,
          isCorrect: ans.isCorrect,
          label: String.fromCharCode(65 + index)
        }))
      };

      const res = await questionService.createQuestion(formattedPayload);
      return res?.data?.data;
    } catch (e) {
      console.error("Lỗi lưu câu hỏi AI:", e);
      throw e;
    }
  };

  return (
      <div className="teacher-question-page" style={{ padding: '24px' }}>
        <UserHeader
            title="Dashboard giáo viên"
            description="Tổng quan hệ thống thi và hoạt động gần đây"
            extra={
              <Space>
                <Button icon={<PlusOutlined />} onClick={() => setOpenQuestion(true)}>
                  Tạo câu hỏi
                </Button>
                {/* 3. THAY ĐỔI TẠI ĐÂY: Chuyển hướng thay vì mở Modal */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/teacher/exams/portal")}
                >
                  Tạo đề thi
                </Button>
              </Space>
            }
        />

        <div style={{ marginTop: 20 }}>
          <StatsCards items={stats.map(item => ({ ...item, key: item.id }))} />
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
          <ScoreChart data={[]} />
          <QuickActions />
        </div>

        <CreateQuestionModal
            open={openQuestion}
            onCancel={() => setOpenQuestion(false)}
            onSave={async (data) => {
              try {
                await handleCreateQuestionAPI(data);
                message.success("Tạo câu hỏi thành công!");
                fetchQuestions();
                fetchStats();
                setOpenQuestion(false);
              } catch (e) {
                console.error(e);
                message.error("Có lỗi xảy ra khi tạo câu hỏi!");
              }
            }}
            categories={categories}
        />

        {/* Ghi chú: Bạn có thể giữ ExamFormModal ở đây để dự phòng,
            nhưng nút bấm phía trên đã chuyển hướng bạn đi chỗ khác rồi
        */}
        {openExam && (
            <ExamFormModal
                exam={null}
                questions={allQuestions}
                categories={categories}
                onClose={() => setOpenExam(false)}
                onCreateQuestion={handleCreateQuestionAPI}
                onSave={async (data) => {
                  try {
                    const finalData = {
                      ...data,
                      code: data.code || `EX${Date.now()}`,
                      duration: "01:00:00",
                      category: data.categoryName || "General",
                      reviewAllowed: "TRUE"
                    };
                    await examService.createExam(finalData);
                    message.success("Tạo đề thi thành công!");
                    fetchStats();
                    setOpenExam(false);
                  } catch (e) {
                    console.error("Lưu đề thi thất bại:", e);
                    message.error("Có lỗi xảy ra khi tạo đề thi!");
                  }
                }}
            />
        )}
      </div>
  );
}