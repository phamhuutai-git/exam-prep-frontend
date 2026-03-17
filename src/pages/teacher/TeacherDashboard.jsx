import { useEffect, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import CreateQuestionModal from "../../components/modal/teacher/Createquestionmodal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal";
import ScoreChart from "../../components/teacher/dashboard/ScoreChart";
import RecentExams from "../../components/teacher/dashboard/RecentExams";
import RecentAttempts from "../../components/teacher/dashboard/RecentAttempts";
import QuickActions from "../../components/teacher/dashboard/QuickActions";

export default function TeacherDashboard() {
  const [stats, setStats] = useState([]);
  const [scoreDist, setScoreDist] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openExam, setOpenExam] = useState(false);

  useEffect(() => {
    // MOCK DATA
    const mockData = {
      scoreDistribution: [
        { range: "0-4", count: 10 },
        { range: "4-5", count: 25 },
        { range: "5-6", count: 50 },
        { range: "6-7", count: 100 },
        { range: "7-8", count: 120 },
        { range: "8-9", count: 80 },
        { range: "9-10", count: 40 },
      ],

      recentExams: [
        {
          id: 1,
          title: "Java Core Test",
          category: "Java",
          attempts: 120,
          avgScore: 7.5,
        },
        {
          id: 2,
          title: "Spring Boot Exam",
          category: "Spring",
          attempts: 90,
          avgScore: 8.2,
        },
        {
          id: 3,
          title: "SQL Advanced",
          category: "SQL",
          attempts: 75,
          avgScore: 6.9,
        },
        {
          id: 4,
          title: "JavaScript Basic",
          category: "JavaScript",
          attempts: 150,
          avgScore: 8.8,
        },
      ],

      recentAttempts: [
        {
          id: 1,
          student: "Nguyen Van A",
          exam: "Java Core Test",
          score: 8.5,
        },
        {
          id: 2,
          student: "Tran Thi B",
          exam: "SQL Advanced",
          score: 6.0,
        },
        {
          id: 3,
          student: "Le Van C",
          exam: "Spring Boot Exam",
          score: 9.0,
        },
        {
          id: 4,
          student: "Pham Thi D",
          exam: "JavaScript Basic",
          score: 7.5,
        },
      ],
    };

    setTimeout(() => {
      setStats(mockData.stats);
      setScoreDist(mockData.scoreDistribution);
      setRecentExams(mockData.recentExams);
      setRecentAttempts(mockData.recentAttempts);
    }, 500);
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
      <StatsCards
        items={[
          { title: "Total Exams", value: 0 },
          { title: "Total Questions", value: 0 },
          { title: "totalStudents", value: 0 },
          { title: "totalAttempts", value: 0 },
        ]}
      />

      {/* ROW 1 */}
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <ScoreChart data={scoreDist} />
        <QuickActions />
      </div>

      {/* ROW 2 */}
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <RecentExams data={recentExams} />
        <RecentAttempts data={recentAttempts} />
      </div>
      {/* CREATE QUESTION */}
      <CreateQuestionModal
        open={openQuestion}
        onCancel={() => setOpenQuestion(false)}
        onSave={(data) => {
          console.log("Question:", data);
          setOpenQuestion(false);
        }}
        categories={[
          { id: 1, name: "Java" },
          { id: 2, name: "Spring" },
          { id: 3, name: "SQL" },
        ]}
      />

      {/* CREATE EXAM */}
      {openExam && (
        <ExamFormModal
          exam={null}
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
