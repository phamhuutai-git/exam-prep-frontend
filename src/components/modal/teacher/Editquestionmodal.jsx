import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Space,
  message,
} from "antd";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const ANSWER_LABELS = ["A", "B", "C", "D"];

export default function EditQuestionModal({
  open,
  question,
  categories,
  onCancel,
  onSave,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (question && categories.length > 0) {
      const answerFields = {};

      if (question.answers) {
        question.answers.forEach((answer, index) => {
          const label = ANSWER_LABELS[index];
          answerFields[`answer_${label}`] = answer.content;
          answerFields[`correct_${label}`] = answer.isCorrect;
        });
      }

      const category = categories.find((c) => c.name === question.category);

      form.setFieldsValue({
        content: question.content,
        explanation: question.explanation,
        difficulty: question.difficulty,
        categoryId: category?.id,
        ...answerFields,
      });
    }
  }, [question, categories, form]);

  const handleOk = () => form.submit();

  const handleFinish = (values) => {
    const answers = ANSWER_LABELS.map((label) => ({
      content: values[`answer_${label}`],
      isCorrect: values[`correct_${label}`] || false,
    }));

    if (!answers.some((a) => a.isCorrect)) {
      message.error("Please select at least one correct answer");
      return;
    }

    const payload = {
      content: values.content,
      explanation: values.explanation,
      difficulty: values.difficulty,
      categoryId: values.categoryId,
      answers,
    };
    onSave(payload);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Chỉnh sửa câu hỏi"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Save"
      destroyOnHidden
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Câu hỏi" name="content" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Mức độ"
              name="difficulty"
              rules={[{ required: true }]}
            >
              <Select>
                {DIFFICULTIES.map((d) => (
                  <Select.Option key={d} value={d}>
                    {d}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true }]}
            >
              <Select>
                {categories.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Đáp án">
          <Space direction="vertical" style={{ width: "100%" }}>
            {ANSWER_LABELS.map((label) => (
              <Row key={label} gutter={8} align="middle">
                <Col flex="none">
                  <Form.Item
                    name={`correct_${label}`}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Checkbox />
                  </Form.Item>
                </Col>

                <Col flex="none">
                  <span style={{ fontWeight: 600 }}>{label}.</span>
                </Col>

                <Col flex="auto">
                  <Form.Item
                    name={`answer_${label}`}
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder={`Answer ${label}`} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Space>
        </Form.Item>
        <Form.Item label="Chú thích" name="explanation">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
