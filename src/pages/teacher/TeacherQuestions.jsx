import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Card,
  Statistic,
  Space,
  Upload,
  message,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import CreateQuestionModal from "../../components/modal/teacher/Createquestionmodal";
import EditQuestionModal from "../../components/modal/teacher/Editquestionmodal";
import ViewQuestionDrawer from "../../components/modal/teacher/Viewquestiondrawer";
import questionService from "../../services/teacher/questionService";
import "../../assets/styles/teacher/Question.css";
const { Search } = Input;

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
  }, [search, diffFilter, catFilter, page, size]);

  // ========================= STATS =========================

  const stats = {
    total: questions.length,
    easy: questions.filter((q) => q.difficulty === "EASY").length,
    medium: questions.filter((q) => q.difficulty === "MEDIUM").length,
    hard: questions.filter((q) => q.difficulty === "HARD").length,
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

  // ========================= TABLE =========================

  const columns = [
    {
      title: "Question",
      dataIndex: "content",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      render: (d) => {
        const color =
          d === "EASY" ? "green" : d === "MEDIUM" ? "orange" : "red";

        return <Tag color={color}>{d}</Tag>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Created",
      dataIndex: "createdDate",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingQuestion(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      {/* HEADER */}
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <h2>Quản Lý Câu Hỏi </h2>
        </Col>

        <Col>
          <Space>
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateOpen(true)}
            >
              Create Question
            </Button>
          </Space>
        </Col>
      </Row>

      {/* STATS */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Easy" value={stats.easy} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Medium" value={stats.medium} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Hard" value={stats.hard} />
          </Card>
        </Col>
      </Row>

      {/* FILTER */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          padding: "12px 16px",
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm kiếm câu hỏi..."
            allowClear
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Divider dọc */}
        <div style={{ width: 1, height: 32, background: "#e8e8e8" }} />

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
        <Table
          rowKey="id"
          columns={columns}
          dataSource={questions}
          pagination={{
            current: page + 1,
            pageSize: size,
            total: total,
            onChange: (p, s) => {
              setPage(p - 1);
              setSize(s);
            },
          }}
        />
      </div>

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
