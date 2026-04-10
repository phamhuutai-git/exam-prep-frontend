import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const CreateAndEditCategories = ({
  open,
  handleCancel,
  handleSubmit,
  loading,
  initialValues, // dùng cho edit
}) => {
  const [form] = Form.useForm();

  // ================= SET DATA KHI EDIT =================
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  // ================= SUBMIT =================
  const onFinish = (values) => {
    handleSubmit(values);
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật danh mục" : "Tạo danh mục"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* NAME */}
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên danh mục!" },
          ]}
        >
          <Input placeholder="Nhập tên danh mục" size="large" />
        </Form.Item>

        {/* BUTTON */}
        <Form.Item style={{ marginBottom: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              {initialValues ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAndEditCategories;