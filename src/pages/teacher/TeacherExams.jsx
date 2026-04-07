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
import { DatePicker, Input, Select, message } from "antd";
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
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [catFilter, setCatFilter] = useState();
  const [dateFilter, setDateFilter] = useState();
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchExams = async () => {
    try {
      const response = await examsAPI.getExamsByTeacher({
        title: search || undefined,
        categoryName: catFilter || undefined,
        minDate: dateFilter?.start || undefined,
        maxDate: dateFilter?.end || undefined,
        page,
        size,
        ...(sortOrder && { sort: `id,${sortOrder}` }),
      });
      const result = response.data.data;
      setExams(result.content);
      setTotal(result.totalElements);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được đề thi");
    }
  };

  useEffect(() => {
    fetchExams();
  }, [search, catFilter, dateFilter, page, size, reload, sortOrder]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await questionService.getAllCategory();
        setCategories(res.data.data.content);
      } catch (err) {
        message.error("Load category failed");
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await questionService.getQuestionsByTeacher({
          page: 0,
          size: 1000,
        });
        setAllQuestions(response.data.data.content);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được danh sách câu hỏi");
      }
    }
    fetchQuestion();
  }, []);

  const handlePreview = async (exam) => {
    try {
      const response = await examsAPI.getQuestionsByExamId(exam.id);
      setPreviewExam({ ...exam, questions: response.data.data });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách câu hỏi");
    }
  };

  const handleEdit = async (exam) => {
    try {
      const response = await examsAPI.getQuestionsByExamId(exam.id);
      const questions = response.data.data || [];
      setEditingExam({ ...exam, questionIds: questions.map((q) => q.id) });
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách câu hỏi");
    }
  };

  const handleAdd = () => {
    setEditingExam(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (examId) => {
    try {
      await examService.deleteExam(examId);
      toast.success("Xóa đề thi thành công");
      setReload((prev) => !prev);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa đề thi");
      console.error(error);
    }
  };

  const handleSaveExam = async (data) => {
    try {
      if (editingExam) {
        await examService.updateExam(editingExam.id, data);
        toast.success("Cập nhật đề thi thành công");
      } else {
        await examService.createExam(data);
        toast.success("Tạo đề thi thành công");
      }
      setReload((prev) => !prev);
      setIsModalOpen(false);
      setEditingExam(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || // backend trả về
        error.response?.data ||          // fallback nếu trả string
        error.message ||                 // lỗi JS
        "Có lỗi xảy ra khi lưu đề thi";

      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleCreateQuestion = async (payload) => {
    try {
      const res = await questionService.createQuestion(payload);
      const newQuestion = res.data.data;
      setAllQuestions((prev) => [...prev, newQuestion]);
      message.success("Tạo câu hỏi thành công");
      return newQuestion;
    } catch (err) {
      message.error("Tạo câu hỏi thất bại");
      console.error(err);
      throw err;
    }
  };

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
          { title: "Tổng số đề thi", value: total },
          { title: "Tổng số câu hỏi", value: allQuestions.length },
          { title: "Danh mục", value: totalCategories },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm kiếm tên đề thi..."
            allowClear
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="filter-divider" />

        {/* Date range filter */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* From date */}
          <DatePicker
            placeholder="Từ"
            allowClear
            style={{ width: 130 }}
            onChange={(date, dateString) => {
              setDateFilter((prev) => ({
                ...prev,
                start: dateString || undefined,
              }));
              setPage(0);
            }}
          />

          {/* To date */}
          <DatePicker
            placeholder="Đến"
            allowClear
            style={{ width: 130 }}
            onChange={(date, dateString) => {
              setDateFilter((prev) => ({
                ...prev,
                end: dateString || undefined,
              }));
              setPage(0);
            }}
          />
        </div>
        <Select
          placeholder="Danh mục"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => {
            setCatFilter(v);
            setPage(0);
          }}
        >
          {categories.map((c) => (
            <Select.Option key={c.id} value={c.name}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Sắp xếp"
          style={{ width: 160 }}
          allowClear
          onChange={(value) => {
            setSortOrder(value || "");
            setPage(0);
          }}
        >
          <Select.Option value="desc">Mới → Cũ</Select.Option>
          <Select.Option value="asc">Cũ → Mới</Select.Option>
        </Select>
      </div>

      <div className="question-table-wrapper">
        <ExamTable
          data={exams}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ExamPreviewModal
        exam={previewExam}
        onClose={() => setPreviewExam(null)}
      />

      {isModalOpen && (
        <ExamFormModal
          exam={editingExam}
          questions={allQuestions}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExam(null);
          }}
          onSave={handleSaveExam}
          onCreateQuestion={handleCreateQuestion}
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
