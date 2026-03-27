import { useState, useMemo, useEffect } from "react";
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
  Button,
  Tooltip,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import CreateQuestionModal from "./Createquestionmodal";

const { Text } = Typography;
const { Option } = Select;

const DIFF_MAP = {
  EASY: { color: "success", label: "Dễ" },
  MEDIUM: { color: "warning", label: "Trung bình" },
  HARD: { color: "error", label: "Khó" },
};

export default function ExamFormModal({
  exam,
  questions: initialQuestions,
  categories,
  onClose,
  onSave,
  onCreateQuestion,
}) {
  const [form] = Form.useForm();
  const [selectedIds, setSelectedIds] = useState([]);
  const [qSearch, setQSearch] = useState("");
  const [qCat, setQCat] = useState("");
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [createQOpen, setCreateQOpen] = useState(false);

  useEffect(() => {
    setQuestions(initialQuestions || []);
  }, [initialQuestions]);

  useEffect(() => {
    if (exam) {
      form.setFieldsValue({
        code: exam.code,
        title: exam.title,
        duration: exam.duration ? convertToMinutes(exam.duration) : undefined,
        category: exam.category,
      });
      if (exam.questionIds) setSelectedIds(exam.questionIds);
    } else {
      form.resetFields();
      setSelectedIds([]);
    }
  }, [exam]);

  function convertToMinutes(time) {
    if (!time) return undefined;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function convertToTime(minutes) {
    if (minutes === undefined) return undefined;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  }

  const filteredQ = useMemo(() => {
    let d = questions;

    if (qSearch) {
      d = d.filter((q) =>
        q.content.toLowerCase().includes(qSearch.toLowerCase()),
      );
    }

    if (qCat) {
      d = d.filter((q) => q.category === qCat);
    }

    return d;
  }, [questions, qSearch, qCat]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...values,
        duration: convertToTime(values.duration),
        questionIds: selectedIds,
      });
    } catch (error) {
      console.log("Validate failed:", error);
    }
  };

  const toggleQuestion = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleCreateQuestion = async (payload) => {
    try {
      let newQuestion;
      if (onCreateQuestion) {
        newQuestion = await onCreateQuestion(payload);
      } else {
        newQuestion = { id: Date.now(), ...payload };
      }
      if (newQuestion?.id) {
        setQuestions((prev) => [...prev, newQuestion]);
        setSelectedIds((prev) => [...prev, newQuestion.id]);
      }
      setCreateQOpen(false);
    } catch (err) {
      console.error("Tạo câu hỏi thất bại:", err);
    }
  };

  return (
    <>
      <Modal
        title={exam ? "Chỉnh sửa đề thi" : "Tạo đề thi"}
        open
        onCancel={onClose}
        onOk={handleOk}
        okText={exam ? "Lưu" : "Tạo đề thi"}
        cancelText="Hủy"
        width={680}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            code: exam?.code,
            title: exam?.title,
            duration: convertToMinutes(exam?.duration),
            category: exam?.category,
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
                <InputNumber
                  min={1}
                  placeholder="30"
                  style={{ width: "100%" }}
                />
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
            <Select placeholder="Chọn danh mục">
              {categories.map((c) => (
                <Option key={c.id} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        {/* ── Phần chọn câu hỏi ── */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text strong>Chọn câu hỏi từ ngân hàng</Text>
            <Space>
              <Text type="secondary">
                Đã chọn: <b>{selectedIds.length}</b>
              </Text>
              <Tooltip title="Tạo câu hỏi mới và thêm vào đề">
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateQOpen(true)}
                >
                  Tạo câu hỏi
                </Button>
              </Tooltip>
            </Space>
          </div>

          {/* Thanh tìm kiếm */}
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
                style={{ width: 150 }}
                placeholder="Tất cả"
              >
                <Option value="">Tất cả</Option>
                {categories.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Danh sách câu hỏi */}
          <div
            style={{
              maxHeight: 220,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {filteredQ.length === 0 && (
              <Text
                type="secondary"
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  display: "block",
                }}
              >
                Không có câu hỏi nào. Hãy tạo câu hỏi mới!
              </Text>
            )}
            {filteredQ.map((q) => {
              const sel = selectedIds.includes(q.id);
              const diff = DIFF_MAP[q.difficulty];
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
                    transition: "all 0.15s",
                  }}
                >
                  <Checkbox checked={sel} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text ellipsis style={{ display: "block" }}>
                      {q.content}
                    </Text>
                    <Space size={4} style={{ marginTop: 3 }}>
                      {diff && <Tag color={diff.color}>{diff.label}</Tag>}
                      {q.category && <Tag>{q.category}</Tag>}
                    </Space>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Modal tạo câu hỏi — hiển thị phía trên */}
      <CreateQuestionModal
        open={createQOpen}
        onCancel={() => setCreateQOpen(false)}
        onSave={handleCreateQuestion}
        categories={categories}
      />
    </>
  );
}
