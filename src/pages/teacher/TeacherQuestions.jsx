import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Row,
  Col,
  Space,
  Upload,
  message,
  Modal,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateQuestionModal from "../../components/modal/teacher/Createquestionmodal";
import EditQuestionModal from "../../components/modal/teacher/Editquestionmodal";
import ViewQuestionDrawer from "../../components/modal/teacher/Viewquestiondrawer";
import questionService from "../../services/teacher/questionService";
import "../../assets/styles/teacher/Question.css";
import "../../assets/styles/User.css";
import QuestionTable from "../../components/teacher/QuestionTable";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import StatsCards from "../../components/common/StatsCards";
export default function TeacherQuestion() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchQuestions = async () => {
    try {
      const res = await questionService.getAllQuestion({
        content: search,
        difficulty: diffFilter,
        categoryId: catFilter,
        page: page,
        size: size,
      });

      setQuestions(res.data.data.content);
      setTotal(res.data.data.totalElements);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Load question failed");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await questionService.getAllCategory();

      setCategories(res.data.data.content);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Load category failed");
    }
  };
  const handleView = async (id) => {
    try {
      const res = await questionService.getDetailQuestion(id);

      setViewingQuestion(res.data.data);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Load question detail failed");
    }
  };
  // Filter state
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState();
  const [catFilter, setCatFilter] = useState();
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Modal / Drawer state
  const [createOpen, setCreateOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);

  // ========================= FILTER =========================

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [search, diffFilter, catFilter, page, size]);

  // ========================= STATS =========================

  const [stats, setStats] = useState({
    countTotal: 0,
    countEasy: 0,
    countMedium: 0,
    countHard: 0,
  });
  const fetchStats = async () => {
    try {
      const res = await questionService.countQuestion();

      setStats(res.data.data);
    } catch (err) {
      message.error("Load stats failed");
    }
  };

  // ========================= CRUD =========================

  const handleCreate = async (values) => {
    try {
      await questionService.createQuestion(values);

      message.success("Question created");

      fetchQuestions();

      setCreateOpen(false);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Create failed");
    }
  };

  const handleEdit = async (values) => {
    try {
      await questionService.updateQuestion(editingQuestion.id, values);

      message.success("Question updated");

      fetchQuestions();

      setEditingQuestion(null);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Update failed");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Question",
      content: "Bạn có chắc muốn xóa câu hỏi này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",

      onOk: async () => {
        try {
          await questionService.deleteQuestion(id);

          message.success("Question deleted");

          fetchQuestions();
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          message.error("Delete failed");
        }
      },
    });
  };

  // ========================= EXPORT/import =========================

  const handleExport = async () => {
    try {
      const res = await questionService.exportQuestion();

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "questions.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      message.success("Export success");
    } catch (err) {
      console.error(err);
      message.error("Export failed");
    }
  };

  const handleImport = async (file) => {
    try {
      await questionService.importQuestion(file);

      message.success("Import success");

      fetchQuestions();
    } catch (err) {
      message.error("Import failed");
    }
  };
  return (
    <div className="teacher-question-page">
      {/* HEADER */}
      {/* <UserHeader
        title="Quản lý câu hỏi"
        description="Tạo, chỉnh sửa, xóa và quản lý câu hỏi"
        buttonText="Thêm câu hỏi"
        handleAdd={() => setCreateOpen(true)}
      /> */}
      <UserHeader
        title="Quản lý câu hỏi"
        description="Tạo, chỉnh sửa, xóa và quản lý câu hỏi"
        buttonText="Thêm câu hỏi"
        handleAdd={() => setCreateOpen(true)}
        extra={
          <>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export
            </Button>

            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleImport(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Import</Button>
            </Upload>
          </>
        }
      />

      {/* STATS */}
      <StatsCards
        items={[
          { title: "Total", value: stats.countTotal },
          { title: "Easy", value: stats.countEasy },
          { title: "Medium", value: stats.countMedium },
          { title: "Hard", value: stats.countHard },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm kiếm câu hỏi..."
            allowClear
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Divider dọc */}
        <div className="filter-divider" />

        {/* Difficulty */}
        <Select
          placeholder="Difficulty"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setDiffFilter(v)}
        >
          {["EASY", "MEDIUM", "HARD"].map((d) => (
            <Select.Option key={d} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
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
      </div>

      <div className="question-table-wrapper">
        <QuestionTable
          data={questions}
          onView={handleView}
          onEdit={(q) => setEditingQuestion(q)}
          onDelete={handleDelete}
        />
      </div>
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />
      {/* CREATE MODAL */}
      <CreateQuestionModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSave={handleCreate}
        categories={categories}
      />

      {/* EDIT MODAL */}
      <EditQuestionModal
        open={!!editingQuestion}
        question={editingQuestion}
        categories={categories}
        onCancel={() => setEditingQuestion(null)}
        onSave={handleEdit}
      />

      {/* VIEW DRAWER */}
      <ViewQuestionDrawer
        question={viewingQuestion}
        onClose={() => setViewingQuestion(null)}
      />
    </div>
  );
}
