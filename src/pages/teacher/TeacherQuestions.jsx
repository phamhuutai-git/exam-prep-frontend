// file
import QuestionTable from "../../components/teacher/QuestionTable";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import StatsCards from "../../components/common/StatsCards";
import CreateQuestionModal from "../../components/modal/teacher/Createquestionmodal";
import EditQuestionModal from "../../components/modal/teacher/Editquestionmodal";
import ViewQuestionDrawer from "../../components/modal/teacher/Viewquestiondrawer";
import questionService from "../../services/teacher/questionService";
// thuvien
import { useState, useEffect } from "react";
import { Button, Input, Select, Upload, message } from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// css
import "../../assets/styles/teacher/Question.css";
import "../../assets/styles/User.css";
export default function TeacherQuestion() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  // Filter state
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState();
  const [catFilter, setCatFilter] = useState();
  const [searchInput, setSearchInput] = useState("");
  // Modal / Drawer state
  const [createOpen, setCreateOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  //star
  const [stats, setStats] = useState({
    countTotal: 0,
    countEasy: 0,
    countMedium: 0,
    countHard: 0,
    loading: true,
  });

  const fetchQuestions = async () => {
    try {
      const res = await questionService.getQuestionsByTeacher({
        content: search,
        difficulty: diffFilter,
        categoryId: catFilter,
        page: page,
        size: size,
        ...(sortOrder && { sort: `id,${sortOrder}` }),
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

  //STATS
  const fetchStats = async () => {
    try {
      const res = await questionService.countQuestion();
      setStats({
        ...res.data.data,
        loading: false,
      });
    } catch (err) {
      message.error("Load stats failed");
      setStats((prev) => ({
        ...prev,
        loading: false,
      }));
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

  //  CRUD

  const handleCreate = async (values) => {
    try {
      await questionService.createQuestion(values);

      message.success("Question created");

      fetchQuestions();
      fetchStats();
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
      fetchStats();

      setEditingQuestion(null);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Update failed");
    }
  };
  const handleDelete = async (id) => {
    try {
      await questionService.deleteQuestion(id);

      message.success("Question deleted");

      fetchQuestions();
      fetchStats();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // EXPORT/import

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
      fetchStats();
    } catch (err) {
      message.error("Import failed");
    }
  };

  //EFFECT
  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // reset page
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // fetch main data
  useEffect(() => {
    fetchQuestions();
  }, [search, diffFilter, catFilter, page, size, sortOrder]);

  // fetch static data
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);
  return (
    <div className="teacher-question-page">
      {/* HEADER */}
      <UserHeader
        title="Quản lý câu hỏi"
        description="Tạo, chỉnh sửa, xóa và quản lý câu hỏi"
        buttonText="Thêm câu hỏi"
        handleAdd={() => setCreateOpen(true)}
        extra={
          <>
            <Button icon={<UploadOutlined />} onClick={handleExport}>
              Export
            </Button>

            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleImport(file);
                return false;
              }}
            >
              <Button icon={<DownloadOutlined />}>Import</Button>
            </Upload>
          </>
        }
      />

      {/* STATS */}
      <StatsCards
        loading={stats.loading}
        items={[
          { title: "Tổng số câu hỏi", value: stats.countTotal },
          { title: "Số câu dễ", value: stats.countEasy },
          { title: "Số câu trung bình", value: stats.countMedium },
          { title: "Số câu khó", value: stats.countHard },
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
          placeholder="Mức độ"
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
          placeholder="Chủ đề"
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

        <Select
          placeholder="Sắp xếp"
          style={{ width: 160 }}
          allowClear
          onChange={(value) => {
            setSortOrder(value || "");
            setPage(0);
          }}
        >
          {" "}
          <Select.Option value="desc">Mới → Cũ</Select.Option>
          <Select.Option value="asc">Cũ → Mới</Select.Option>
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
