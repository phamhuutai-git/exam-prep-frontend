import React from 'react'
import { Modal, Form, Input, Button, Space } from 'antd'
const Add = ({ open, isEditMode, form, loading, onCancel, onSubmit }) => {
  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa lớp' : 'Tạo lớp mới'}
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="Tên lớp"
          rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
        >
          <Input placeholder="VD: Lớp Java cơ bản 01" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {isEditMode ? 'Cập nhật' : 'Tạo lớp'}
            </Button>
          </Space>
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default Add