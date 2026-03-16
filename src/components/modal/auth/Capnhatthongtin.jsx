import React from "react";
import { Modal, Form, Input, Button, message } from "antd";

const Capnhatthongtin = ({
  open = false,
  onCancel = () => {},
  onUpdate = () => {},
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onUpdate(values);
    message.success("Cập nhật thông tin thành công!");
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={open}
      footer={null}
      onCancel={onCancel}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          fullName: "",
          email: "",
        }}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" size="large" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button onClick={onCancel} size="large">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Capnhatthongtin;
