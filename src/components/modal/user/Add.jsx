import React from "react";
import { Modal, Form, Input, Select, Switch, Button } from "antd";
const Add = ({ open, isEditMode, form, loading, onCancel, onSubmit }) => {
  // Watch role value internally for conditional rendering
  const roleValue = Form.useWatch("role", form);

  return (
    <Modal
      title={isEditMode ? "Cập nhật người dùng" : "Thêm người dùng"}
      open={open}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ role: "student", isActive: true }}
      >
        {/* USERNAME */}
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
        >
          <Input disabled={isEditMode} />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Nhập email" }]}
        >
          <Input />
        </Form.Item>

        {/* FULLNAME */}
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Nhập họ và tên" }]}
        >
          <Input />
        </Form.Item>

        {/* ROLE */}
        <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "admin", label: "Quản trị viên" },
              { value: "teacher", label: "Giáo viên" },
              { value: "student", label: "Học sinh" },
            ]}
          />
        </Form.Item>

        {/* STATUS */}
        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
        </Form.Item>

        {/* CLASS - chỉ hiện khi student */}
        {roleValue === "student" && (
          <Form.Item
            label="Lớp"
            name="className"
            rules={[{ required: true, message: "Chọn lớp" }]}
          >
            <Select
              options={[
                { value: "Lớp 10A1", label: "Lớp 10A1" },
                { value: "Lớp 10A2", label: "Lớp 10A2" },
                { value: "Lớp 11A1", label: "Lớp 11A1" },
              ]}
            />
          </Form.Item>
        )}

        {/* SUBJECT - chỉ hiện khi teacher */}
        {roleValue === "teacher" && (
          <Form.Item
            label="Môn"
            name="subject"
            rules={[{ required: true, message: "Chọn môn" }]}
          >
            <Select
              options={[
                { value: "Toán", label: "Toán" },
                { value: "Văn", label: "Văn" },
              ]}
            />
          </Form.Item>
        )}

        <Button type="primary" htmlType="submit" loading={loading}>
          {isEditMode ? "Cập nhật" : "Thêm"}
        </Button>
      </Form>
    </Modal>
  );
};

export default Add;
