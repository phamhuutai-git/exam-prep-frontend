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


export default function ExamFormModal({ exam, questions, onClose, onSave }) {

  const [form] = Form.useForm();
  const [selectedIds, setSelectedIds] = useState([]);
  const [qSearch, setQSearch] = useState("");
  const [qCat, setQCat] = useState("");

  useEffect(() => {
    if (exam) {
      console.log("Edit exam: ", exam);
      form.setFieldValue({
        code: exam.code,
        title: exam.title,
        duration: exam.duration ? Number(exam.duration) : undefined,
        category: exam.category,
      });

      if (exam.questionIds) {
        setSelectedIds(exam.questionIds);
      }
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
    if (qSearch)
      d = d.filter((q) =>
        q.content.toLowerCase().includes(qSearch.toLowerCase()),
      );
    if (qCat) d = d.filter((q) => q.category === qCat);
    return d;
  }, [qSearch, qCat]);

  //Lay du lieu tu form va selectedIds, chuyen duration ve dinh dang "hh:mm:ss", sau do goi onSave
  //onSave se duoc truyen tu TeacherExams.jsx, va se goi API de luu du lieu
  //Sau khi luu xong, dong modal va refresh lai danh sach de thi
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const dataLoad = {
        ...values,
        duration: convertToTime(values.duration), //Chuyen ve dinh dang "hh:mm:ss"
        questionIds: selectedIds,
      };

      onSave(dataLoad);
    } catch (error) {
      console.log("Validate failed:", error);
    }
  };


  // const handleOk = () => {
  //   form.validateFields().then((values) => {
  //     onSave({
  //       ...values,
  //       duration: String(values.duration),
  //       questionIds: selectedIds,
  //     });
  //   });
  // };

  const toggleQuestion = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <Modal
      title={exam ? "Edit Exam" : "Create Exam"}
      open
      onCancel={onClose}
      onOk={handleOk}
      okText={exam ? "Save" : "Create Exam"}
      cancelText="Cancel"
      width={680}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          code: exam?.code,
          title: exam?.title,
          duration: convertToMinutes(exam?.duration),
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
