import { useEffect, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import CreateQuestionModal from "../../components/modal/teacher/Createquestionmodal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal";
import ScoreChart from "../../components/teacher/dashboard/ScoreChart";
import QuickActions from "../../components/teacher/dashboard/QuickActions";
import questionService from "../../services/teacher/questionService";
import dashBoardService from "../../services/teacher/dashboardService";
export default function TeacherDashboard() {
  const [stats, setStats] = useState([]);
  const [scoreDist, setScoreDist] = useState([]);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openExam, setOpenExam] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashBoardService.stats();

        const data = res.data.data;

        setStats([
          { title: "Tổng số đề thi", value: data.totalExams },
          { title: "Tổng số câu hỏi", value: data.totalQuestions },
          { title: "Tổng số học sinh", value: data.totalStudents },
        ]);
      } catch (err) {
        console.error("Lỗi load stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await questionService.getQuestionsByTeacher({
          page: 0,
          size: 1000,
        });
        setAllQuestions(res.data.data.content);
      } catch (err) {
        console.error("Lỗi load questions:", err);
      }
    };

    fetchQuestions();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await questionService.getAllCategory();
        setCategories(res.data.data.content);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="teacher-question-page">
      {/* HEADER */}
      <UserHeader
        title="Dashboard giáo viên"
        description="Tổng quan hệ thống thi và hoạt động gần đây"
        extra={
          <>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenQuestion(true)}
            >
              Tạo câu hỏi
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenExam(true)}
            >
              Tạo đề thi
            </Button>
          </>
        }
      />

      {/* STATS */}
      <StatsCards items={stats} />

      {/* ROW 1 */}
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <ScoreChart data={scoreDist} />
        <QuickActions />
      </div>
      {/* CREATE QUESTION */}
      <CreateQuestionModal
        open={openQuestion}
        onCancel={() => setOpenQuestion(false)}
        onSave={(data) => {
          console.log("Question:", data);
          setOpenQuestion(false);
        }}
        categories={categories}
      />

      {/* CREATE EXAM */}

      {openExam && (
        <ExamFormModal
          exam={null}
          questions={allQuestions}
          categories={categories}
          onClose={() => setOpenExam(false)}
          onSave={(data) => {
            console.log("Exam:", data);
            setOpenExam(false);
          }}
        />
      )}
    </div>
  );
}
