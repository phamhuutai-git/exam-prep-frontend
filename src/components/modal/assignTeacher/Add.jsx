import React from "react";
import { Modal, Form, Select, Button, Input } from "antd";
import { mockTeachers } from "../../../services/assignTeacherService.js";

const mockClasses = [
  { value: "lop10a1", label: "Lớp 10A1" },
  { value: "lop11a2", label: "Lớp 11A2" },
  { value: "lop12b1", label: "Lớp 12B1" },
];

const Add = ({
  open,
  isEditMode,
  form,
  loading,
  onCancel,
  onSubmit,
}) => {

  // chọn username giáo viên
  const handleSelectTeacher = (value) => {
    const selectedTeacher = mockTeachers.find(
      (t) => t.value === value
    );

    if (selectedTeacher) {
      form.setFieldsValue({
        teacher: selectedTeacher.label, // hiện tên giáo viên
      });
    }
  };

  return (
    <Modal
      title={
        isEditMode
          ? "Chỉnh sửa phân công giáo viên"
          : "Thêm phân công mới"
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        
        {/* Lớp học */}
        <Form.Item
          name="className"
          label="Lớp học"
          rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
        >
          <Select placeholder="Chọn lớp học">
            {mockClasses.map((c) => (
              <Select.Option key={c.value} value={c.value}>
                {c.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Username giáo viên */}
        <Form.Item
          name="username"
          label="Tên đăng nhập giáo viên"
          rules={[{ required: true, message: "Vui lòng chọn username!" }]}
        >
          <Select
            placeholder="Chọn username giáo viên"
            onChange={handleSelectTeacher}
          >
            {mockTeachers.map((t) => (
              <Select.Option key={t.value} value={t.value}>
                {t.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Hiển thị tên giáo viên */}
        <Form.Item
          name="teacher"
          label="Tên giáo viên"
        >
          <Input placeholder="Tên giáo viên sẽ hiển thị" disabled />
        </Form.Item>

        {/* Button */}
        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? "Cập nhật" : "Tạo phân công"}
            </Button>
          </div>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default Add;