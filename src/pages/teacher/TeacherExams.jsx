import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Input, Select, message, Space } from "antd";
import { toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 1. Thêm import điều hướng

// Components
import UserHeader from "../../components/user/UserHeader";
import ExamTable from "../../components/teacher/ExamTable";
import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal.jsx";
import AppPagination from "../../components/common/AppPagination.jsx";
import StatsCards from "../../components/common/StatsCards";

// Services
import * as examsAPI from "../../services/teacher/examService.js";
import questionService from "../../services/teacher/questionService.js";

// CSS
import "../../assets/styles/User.css";
import "../../assets/styles/teacher/Question.css";

const TeacherExams = () => {
  const navigate = useNavigate(); // 2. Khởi tạo navigate

  // --- States ---
  const [examData, setExamData] = useState({ list: [], total: 0 });
  const [previewExam, setPreviewExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [categories, setCategories] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [reload, setReload] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState();
  const [dateFilter, setDateFilter] = useState();
  const [sortOrder, setSortOrder] = useState("");

  // --- Fetch Callbacks ---

  const fetchExams = useCallback(async () => {
    try {
      const params = {
        title: search || undefined,
        categoryName: catFilter || undefined,
        minDate: dateFilter?.start || undefined,
        maxDate: dateFilter?.end || undefined,
        page,
        size,
        ...(sortOrder && { sort: `id,${sortOrder}` }),
      };
      const response = await examsAPI.getExamsByTeacher(params);
      const result = response.data?.data;
      if (result) {
        setExamData({
          list: result.content || [],
          total: result.totalElements || 0
        });
      }
    } catch (err) {
      console.error("Fetch exams error:", err);
    }
  }, [search, catFilter, dateFilter, page, size, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await questionService.getAllCategory();
      const content = res.data?.data?.content;
      if (content) setCategories(content);
    } catch (err) {
      console.error("Load category failed:", err);
    }
  }, []);

  const fetchQuestion = useCallback(async () => {
    try {
      const response = await questionService.getQuestionsByTeacher({ page: 0, size: 1000 });
      const content = response.data?.data?.content;
      if (content) setAllQuestions(content);
    } catch (err) {
      console.error("Fetch questions error:", err);
    }
  }, []);

  // --- Effects ---

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (isMounted) await fetchExams();
    };
    void init();
    return () => { isMounted = false; };
  }, [fetchExams, reload]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (isMounted) await fetchCategories();
    };
    void init();
    return () => { isMounted = false; };
  }, [fetchCategories]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (isMounted) await fetchQuestion();
    };
    void init();
    return () => { isMounted = false; };
  }, [fetchQuestion]);

  // --- Handlers ---

  const handlePreview = async (exam) => {
    try {
      const response = await examsAPI.getQuestionsByExamId(exam.id);
      setPreviewExam({ ...exam, questions: response.data.data });
    } catch (err) {
      console.error("Preview error:", err);
      toast.error("Lỗi khi tải danh sách câu hỏi");
    }
  };

  const handleEdit = async (exam) => {
    try {
      const response = await examsAPI.getQuestionsByExamId(exam.id);
      const questionsData = response.data.data || [];
      setEditingExam({ ...exam, questionIds: questionsData.map((q) => q.id) });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Lỗi khi tải nội dung đề thi");
    }
  };

  // 3. Cập nhật hàm Add: Điều hướng sang trang Portal chọn phương thức tạo đề
  const handleAdd = () => {
    navigate("/teacher/exams/portal");
  };

  const handleDelete = async (examId) => {
    try {
      await examsAPI.deleteExam(examId);
      toast.success("Xóa đề thi thành công");
      setReload((prev) => !prev);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Có lỗi xảy ra khi xóa đề thi");
    }
  };

  const handleSaveExam = async (data) => {
    try {
      const formattedData = {
        title: data.title,
        code: data.code || `EX${Date.now()}`,
        duration: data.duration || "01:00:00",
        category: data.category || data.categoryName || "General",
        examType: data.examType || "PRACTICE",
        reviewAllowed: data.reviewAllowed === false ? "FALSE" : "TRUE",
        passScore: parseFloat(data.passScore) || 5.0,
        questionIds: data.questionIds || [],
      };

      if (editingExam) {
        await examsAPI.updateExam(editingExam.id, formattedData);
        toast.success("Cập nhật đề thi thành công");
      } else {
        await examsAPI.createExam(formattedData);
        toast.success("Tạo đề thi thành công!");
      }

      setReload((prev) => !prev);
      setIsModalOpen(false);
      setEditingExam(null);
    } catch (err) {
      console.error("Save Exam Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Lưu đề thi thất bại");
    }
  };

  const handleCreateQuestion = async (payload) => {
    try {
      const existingQuestion = allQuestions.find(
          (q) => q.content.trim().toLowerCase() === payload.content.trim().toLowerCase()
      );

      if (existingQuestion) return existingQuestion;

      const foundCat = categories.find((c) =>
          c.name.toLowerCase().includes(payload.category?.toLowerCase())
      ) || categories[0];

      const formattedPayload = {
        content: payload.content,
        difficulty: (payload.difficulty || "MEDIUM").toUpperCase(),
        categoryId: foundCat?.id,
        explanation: payload.explanation || "AI Generated Content",
        answers: payload.answers.map((ans, index) => ({
          content: ans.content,
          isCorrect: ans.isCorrect,
          label: String.fromCharCode(65 + index),
        })),
      };

      const res = await questionService.createQuestion(formattedPayload);
      const newQuestion = res.data.data;

      setAllQuestions((prev) => {
        if (prev.some((q) => q.id === newQuestion.id)) return prev;
        return [...prev, newQuestion];
      });

      message.success("Lưu câu hỏi AI thành công");
      return newQuestion;
    } catch (err) {
      console.error("Save AI question error:", err);
      message.error("Không thể lưu câu hỏi AI");
      throw err;
    }
  };

  return (
      <div className="teacher-question-page">
        <UserHeader
            title="Quản lý đề thi"
            description="Tạo đề thi thông minh với ngân hàng câu hỏi hỗ trợ AI"
            buttonText="Thêm đề thi"
            handleAdd={handleAdd}
        />

        <StatsCards
            items={[
              { title: "Tổng số đề thi", value: examData.total },
              { title: "Tổng số câu hỏi", value: allQuestions.length },
              { title: "Danh mục đề", value: new Set(examData.list.map((e) => e.category)).size },
            ]}
        />

        <div className="filter-bar">
          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Tìm tên đề thi..."
                allowClear
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="filter-divider" />
          <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: 150 }}
              onChange={(v) => { setCatFilter(v); setPage(0); }}
          >
            {categories.map((c) => (
                <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
            ))}
          </Select>

          <Space>
            <DatePicker
                placeholder="Từ ngày"
                style={{ width: 130 }}
                onChange={(_, dateString) => {
                  setDateFilter((prev) => ({ ...prev, start: dateString || undefined }));
                  setPage(0);
                }}
            />
            <DatePicker
                placeholder="Đến ngày"
                style={{ width: 130 }}
                onChange={(_, dateString) => {
                  setDateFilter((prev) => ({ ...prev, end: dateString || undefined }));
                  setPage(0);
                }}
            />
          </Space>

          <Select
              placeholder="Sắp xếp"
              style={{ width: 160 }}
              allowClear
              onChange={(value) => { setSortOrder(value || ""); setPage(0); }}
          >
            <Select.Option value="desc">Mới nhất</Select.Option>
            <Select.Option value="asc">Cũ nhất</Select.Option>
          </Select>
        </div>

        <div className="question-table-wrapper">
          <ExamTable
              data={examData.list}
              loading={false}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
          />
        </div>

        <ExamPreviewModal exam={previewExam} onClose={() => setPreviewExam(null)} />

        {/* Modal này vẫn giữ lại để phục vụ tính năng Sửa đề thi (handleEdit) */}
        {isModalOpen && (
            <ExamFormModal
                exam={editingExam}
                questions={allQuestions}
                categories={categories}
                onClose={() => { setIsModalOpen(false); setEditingExam(null); }}
                onSave={handleSaveExam}
                onCreateQuestion={handleCreateQuestion}
            />
        )}

        <AppPagination
            page={page}
            size={size}
            total={examData.total}
            onChange={(p, s) => { setPage(p); setSize(s); }}
        />
      </div>
  );
};

export default TeacherExams;