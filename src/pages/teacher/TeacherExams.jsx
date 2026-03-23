// file
import UserHeader from "../../components/user/UserHeader";
import ExamTable from "../../components/teacher/ExamTable";
import * as examsAPI from "../../services/teacher/examService.js";
import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal.jsx";
import AppPagination from "../../components/common/AppPagination.jsx";
import StatsCards from "../../components/common/StatsCards";
import examService from "../../services/teacher/examService.js";
import questionService from "../../services/teacher/questionService.js";

//thu vien
import React, { useState, useEffect } from "react";
import { DatePicker, Input, Select } from "antd";
import { toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
// css
import "../../assets/styles/User.css";
import "../../assets/styles/teacher/Question.css";


const TeacherExams = () => {
  const [exams, setExams] = useState([]);
  const [previewExam, setPreviewExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [reload, setReload] = useState(false);

  //filter states
  const [titleInput, setSearchInput] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  //Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleFilter(titleInput);
      setPage(0); // reset page when filter changes
    }, 500);

    return () => clearTimeout(timer);
  }, [titleInput]);

  //Get all exams of teacher
  useEffect(() => {
    async function fetchExams() {
      try {
        const response = await examsAPI.getExamsByTeacher(page, size, {
          title: titleFilter,
          categoryName: categoryFilter,
          minDate,
          maxDate,
        });
        const result = response.data.data;

        setExams(result.content);
        setTotal(result.totalElements);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được đề thi");
      }
    }

    fetchExams();
  }, [page, size, reload, titleFilter, categoryFilter, minDate, maxDate]);

  useEffect(() => {
    async function fetchQuestion() {
      try {

        const response = await questionService.getAllQuestion({ page: 0, size: 1000 });
        console.log("All question: ", response.data.data.content);
        setAllQuestions(response.data.data.content);

      } catch (error) {
        console.error(error);
        toast.error("Không tải được danh sách câu hỏi");
      }
    }

    fetchQuestion();
  }, [reload]);

  //Get all category
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await questionService.getAllCategory();
        setCategories(response.data.data.content);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được danh sách thể loại");
      }

    } fetchCategory();
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

  const handleEdit = async (exam) => {
    try {
      const response = await examsAPI.getQuestionsByExamId(exam.id);
      const questions = response.data.data || [];

      const questionIds = questions.map((q) => q.id);
      const examWithQuestions = {
        ...exam,
        questionIds,
      };
      setEditingExam(examWithQuestions);
      setIsModalOpen(true);

    } catch (error) {
      toast.error("Lỗi khi tải danh sách câu hỏi");
    }
  };

  const handleClosePreview = () => {
    setPreviewExam(null);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    setEditingExam(null);
  };

  const handleDelete = async (examId) => {
    try {
      await examService.deleteExam(examId);

      toast.success("Xóa đề thi thành công");
      setReload(prev => !prev);

    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa đề thi");
      console.error(error);
    }
  }

  const totalCategories = new Set(exams.map((e) => e.category)).size;


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
          { title: "Total Exams", value: exams.length },
          { title: "Total Questions", value: 0 },
          { title: "Avg Duration", value: 0 },
          { title: "Categories", value: totalCategories },
        ]}
      />
      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Search Exam by title..."
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
          onChange={(v) => {
            setCategoryFilter(v ?? null);
            setPage(0);
          }}
        >
          {categories.map((c) => (
            <Select.Option key={c.id} value={c.name}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Từ ngày"
          allowClear
          style={{ width: 155 }}
          onChange={(_, dateString) => {
            setMinDate(dateString || null);
            setPage(0);
          }}
        />
        <DatePicker
          placeholder="Đến ngày"
          allowClear
          style={{ width: 155 }}
          onChange={(_, dateString) => {
            setMaxDate(dateString || null);
            setPage(0);
          }}
        />

      </div>

      <div className="question-table-wrapper">
        <ExamTable data={exams} onPreview={handlePreview} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <ExamPreviewModal exam={previewExam} onClose={handleClosePreview} />

      {isModalOpen && (
        <ExamFormModal
          exam={editingExam}
          questions={allQuestions}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExam(null);
          }}
          onSave={async (data) => {
            try {
              if (editingExam) {
                // Update exam
                await examService.updateExam(editingExam.id, data);
                toast.success("Cập nhật đề thi thành công");
              } else {
                // Create new exam
                await examService.createExam(data);
                toast.success("Tạo đề thi thành công");
              }

              // Refresh exam list
              setReload(prev => !prev);

              setIsModalOpen(false);
              setEditingExam(null);

            } catch (error) {
              toast.error("Có lỗi xảy ra khi lưu đề thi");
              console.error(error);

            }
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
