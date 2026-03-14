
import { useState, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Checkbox,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const CATEGORIES = ["Java", "Spring", "SQL", "HTML", "JavaScript"];
const DIFF_MAP = {
  EASY: { color: "success", label: "Dễ" },
  MEDIUM: { color: "warning", label: "Trung bình" },
  HARD: { color: "error", label: "Khó" },
};
const CAT_COLORS = {
  Java: "green",
  Spring: "cyan",
  SQL: "blue",
  HTML: "orange",
  JavaScript: "magenta",
};
const ALL_QUESTIONS = [
  {
    id: 1,
    content: "What is Java?",
    difficulty: "EASY",
    category: "Java",
    answers: [
      { content: "Programming Language", isCorrect: true },
      { content: "Database", isCorrect: false },
      { content: "Operating System", isCorrect: false },
      { content: "Web Browser", isCorrect: false },
    ],
  },
  {
    id: 2,
    content: "Explain OOP principles",
    difficulty: "MEDIUM",
    category: "Java",
    answers: [
      {
        content: "Encapsulation, Inheritance, Polymorphism, Abstraction",
        isCorrect: true,
      },
      { content: "Compilation only", isCorrect: false },
      { content: "Indexing", isCorrect: false },
      { content: "None of the above", isCorrect: false },
    ],
  },
  {
    id: 3,
    content: "What is Spring Boot?",
    difficulty: "EASY",
    category: "Spring",
    answers: [
      { content: "Java Framework", isCorrect: false },
      { content: "Spring Boot Framework", isCorrect: true },
      { content: "Database Tool", isCorrect: false },
      { content: "Programming Language", isCorrect: false },
    ],
  },
  {
    id: 4,
    content: "What is Primary Key?",
    difficulty: "EASY",
    category: "SQL",
    answers: [
      { content: "Unique identifier", isCorrect: true },
      { content: "Allows duplicate", isCorrect: false },
      { content: "Can be null", isCorrect: false },
      { content: "Optional field", isCorrect: false },
    ],
  },
  {
    id: 5,
    content: "What is HTML?",
    difficulty: "EASY",
    category: "HTML",
    answers: [
      { content: "Programming Language", isCorrect: false },
      { content: "Markup Language", isCorrect: true },
      { content: "Database System", isCorrect: false },
      { content: "Operating System", isCorrect: false },
    ],
  },
];

export default function ExamFormModal({ exam, onClose, onSave }) {
  const [form] = Form.useForm();
  const [selectedIds, setSelectedIds] = useState(exam?.questionIds || []);
  const [qSearch, setQSearch] = useState("");
  const [qCat, setQCat] = useState("");

  const filteredQ = useMemo(() => {
    let d = ALL_QUESTIONS;
    if (qSearch)
      d = d.filter((q) =>
        q.content.toLowerCase().includes(qSearch.toLowerCase()),
      );
    if (qCat) d = d.filter((q) => q.category === qCat);
    return d;
  }, [qSearch, qCat]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({
        ...values,
        duration: String(values.duration),
        questionIds: selectedIds,
      });
    });
  };

  const toggleQuestion = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <Modal
      title={exam ? "Cập nhật đề thi" : "Tạo đề thi mới"}
      open
      onCancel={onClose}
      onOk={handleOk}
      okText={exam ? "Lưu thay đổi" : "Tạo đề thi"}
      cancelText="Hủy"
      width={680}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          code: exam?.code,
          title: exam?.title,
          duration: Number(exam?.duration) || undefined,
          category: exam?.category || "Java",
        }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã đề"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input placeholder="VD: EX006" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Thời gian (phút)"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <InputNumber min={1} placeholder="30" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="title"
          label="Tên đề thi"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input placeholder="VD: Java Advanced Test" />
        </Form.Item>
        <Form.Item name="category" label="Danh mục">
          <Select>
            {CATEGORIES.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text strong>Chọn câu hỏi từ ngân hàng</Text>
          <Text type="secondary">
            Đã chọn: <b>{selectedIds.length}</b>
          </Text>
        </div>
        <Row gutter={8} style={{ marginBottom: 10 }}>
          <Col flex={1}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm câu hỏi..."
              value={qSearch}
              onChange={(e) => setQSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              value={qCat}
              onChange={setQCat}
              style={{ width: 140 }}
              placeholder="Tất cả"
            >
              <Option value="">Tất cả</Option>
              {CATEGORIES.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <div
          style={{
            maxHeight: 220,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {filteredQ.map((q) => {
            const sel = selectedIds.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => toggleQuestion(q.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${sel ? "#b7eb8f" : "#f0f0f0"}`,
                  background: sel ? "#f6ffed" : "#fafafa",
                  cursor: "pointer",
                }}
              >
                <Checkbox checked={sel} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text ellipsis style={{ display: "block" }}>
                    {q.content}
                  </Text>
                  <Space size={4} style={{ marginTop: 3 }}>
                    <Tag color={DIFF_MAP[q.difficulty].color}>
                      {DIFF_MAP[q.difficulty].label}
                    </Tag>
                    <Tag color={CAT_COLORS[q.category]}>{q.category}</Tag>
                  </Space>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
