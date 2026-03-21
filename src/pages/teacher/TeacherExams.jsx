// file
import UserHeader from "../../components/user/UserHeader";
import ExamTable from "../../components/teacher/ExamTable";
import * as examsAPI from "../../services/teacher/examService.js";
import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal.jsx";
import AppPagination from "../../components/common/AppPagination.jsx";
import StatsCards from "../../components/common/StatsCards";
import * as examService from "../../services/teacher/examService.js";
//thu vien
import React, { useState, useEffect } from "react";
import { Form, DatePicker, Input, Select } from "antd";
import { toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
// css
import "../../assets/styles/User.css";
import "../../assets/styles/teacher/Question.css";
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
  const [catFilter, setCatFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  //Get all exams of teacher
  useEffect(() => {
    async function fetchExams() {
      try {
        const response = await examService.getExamsByTeacher();
        const result = response.data.data;

        setExams(result.content);
        setTotal(result.totalElements);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được đề thi");
      }
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
      <UserHeader
        title="Quản lý đề thi"
        description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
        buttonText="Thêm đề thi"
        handleAdd={handleAdd}
      />

      <StatsCards
        items={[
          { title: "Total Exams", value: 0 },
          { title: "Total Questions", value: 0 },
          { title: "Avg Duration", value: 0 },
          { title: "Categories", value: 0 },
        ]}
      />
      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Search Exam..."
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
