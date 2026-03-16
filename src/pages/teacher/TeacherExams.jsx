import React, { useState, useEffect } from "react";
import { Form, DatePicker } from "antd";
import { toast } from "react-toastify";
import "../../assets/styles/User.css";
import "../../assets/styles/teacher/Question.css";
import UserHeader from "../../components/user/UserHeader";
import ExamTable from "../../components/teacher/ExamTable";
import * as examsAPI from "../../services/teacher/examService.js";
import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal.jsx";
import AppPagination from "../../components/common/AppPagination.jsx";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import StatsCards from "../../components/common/StatsCards";
const TeacherExams = () => {
  const [exams, setExams] = useState([]);
  const [previewExam, setPreviewExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalQuestions: 0,
    avgDuration: 0,
    totalCategories: 0,
  });
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
    <div className="teacher-question-page">
      {/* Header + Button cùng hàng */}
      <UserHeader
        title="Quản lý đề thi"
        description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
        buttonText="Thêm đề thi"
        handleAdd={handleAdd}
      />
      <StatsCards
        items={[
          { title: "Total Exams", value: stats.totalExams },
          { title: "Total Questions", value: stats.totalQuestions },
          { title: "Avg Duration", value: stats.avgDuration, suffix: "min" },
          { title: "Categories", value: stats.totalCategories },
        ]}
      />
      {/* FILTER */}
      <div className="filter-bar" >
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm kiếm đề thi..."
            allowClear
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {/* Divider dọc */}
        <div className="filter-divider" />{" "}
        <Select
          placeholder="Category"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setCatFilter(v)}
        >
          {categories.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Create date"
          allowClear
          style={{ width: 180 }}
          onChange={(date, dateString) => setDateFilter(dateString)}
        />
      </div>
      <div style={{ marginBottom: 16 }} />
      <div className="question-table-wrapper">
        <ExamTable data={exams} onPreview={handlePreview} onEdit={handleEdit} />
      </div>

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
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />
    </div>
  );
};
export default TeacherExams;
