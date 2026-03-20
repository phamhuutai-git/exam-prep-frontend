import { useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  List,
  Button,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";

export default function EditClassExamModal({
  open,
  data, // class
  exams, // list exam
  onCancel,
  onSave,
  onRemoveExam, // (classId, examId)
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        examId: undefined,
        duration: undefined,
        startTime: null,
        endTime: null,
      });
    }
  }, [data, form]);

  const handleOk = () => form.submit();

  const handleFinish = (values) => {
    const payload = {
      examId: values.examId,
      duration: values.duration,
      startTime: values.startTime,
      endTime: values.endTime,
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
      // lay name class nhe
      title={`Edit Class: ${data?.name || ""}`}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Save"
      destroyOnHidden
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Exam"
          name="examId"
          rules={[{ required: true, message: "Chọn đề thi" }]}
        >
          <Select placeholder="Chọn đề">
            {exams.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Duration (phút)"
          name="duration"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Form.Item label="Start Time" name="startTime">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="End Time" name="endTime">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
      </Form>

      {/* LIST EXAM ĐÃ GÁN */}
      <List
        header={`Assigned Exams (${data?.exams?.length || 0})`}
        dataSource={data?.exams || []}
        style={{ marginTop: 16 }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Xóa đề này?"
                onConfirm={() => onRemoveExam(data.id, item.id)}
              >
                <Button danger size="small">
                  Xóa
                </Button>
              </Popconfirm>,
            ]}
          >
            <Space>
              <Tag color="blue">{item.title}</Tag>
              <Tag>{item.duration} phút</Tag>
              {item.startTime && (
                <Tag color="green">
                  {dayjs(item.startTime).format("DD/MM HH:mm")}
                </Tag>
              )}
            </Space>
          </List.Item>
        )}
      />
    </Modal>
  );
}
