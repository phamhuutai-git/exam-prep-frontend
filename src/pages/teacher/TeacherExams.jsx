// export default function TeacherExamManagement() {
//   return(
//     <div>exam</div>
//   )
// }
import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { toast } from "react-toastify";
import "../../assets/styles/User.css";
import UserHeader from "../../components/user/UserHeader";
import ExamTable from "../../components/teacher/ExamTable";
import * as examsAPI from "../../services/teacher/examService.js";
import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal.jsx";

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [previewExam, setPreviewExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  //Get all exams of teacher
  useEffect(() => {
    async function fetchExams() {
      const response = await examsAPI.getExamsByTeacher();
      console.log("Exams: ", response);
      setExams(response.data.data.content);
    }
    fetchExams();
  }, []);

  const handlePreview = async (exam) => {
    try {
      const response = await examsAPI.getQuestionsByExamId(exam.id);

      const examWithQuestions = {
        ...exam,
        questions: response.data.data,
      };
      setPreviewExam(examWithQuestions);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách câu hỏi");
    }
  };

  const handleEdit = (exam) => {
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewExam(null);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header + Button cùng hàng */}
      <UserHeader
        title="Quản lý đề thi"
        description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
        buttonText="Thêm đề thi"
        handleAdd={handleAdd}
      />

      <ExamTable data={exams} onPreview={handlePreview} onEdit={handleEdit} />

      <ExamPreviewModal exam={previewExam} onClose={handleClosePreview} />

      {isModalOpen && (
        <ExamFormModal
          exam={isEditMode}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(null);
          }}
          onSave={(data) => {
            console.log("Data save: ", data);
            setIsModalOpen(false);
            setIsEditMode(null);
          }}
        />
      )}
    </div>
  );
};
export default Exam;
