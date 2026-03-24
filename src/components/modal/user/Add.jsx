import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Switch } from 'antd'

const Add = ({
  open,
  isEditMode,
  form,
  loading,
  onCancel,
  onSubmit
}) => {

  // ✅ đảm bảo khi mở modal luôn có status
  useEffect(() => {
    if (open) {
      const currentStatus = form.getFieldValue('status')

      if (!currentStatus) {
        form.setFieldsValue({
          status: 'ACTIVED'
        })
      }
    }
  }, [open, form])

  return (
    <Modal
      title={isEditMode ? 'Cập nhật người dùng' : 'Thêm người dùng'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        {/* USERNAME */}
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: 'Vui lòng nhập username' }]}
        >
          <Input disabled={isEditMode} />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>

        {/* FULL NAME */}
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>

        {/* ROLE */}
        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'teacher', label: 'Giáo viên' },
              { value: 'student', label: 'Học sinh' }
            ]}
          />
        </Form.Item>

        {/* STATUS chỉ khi edit */}
        {isEditMode && (
          <Form.Item
            name="status"
            label="Trạng thái"
            valuePropName="checked"
            getValueFromEvent={(checked) =>
              checked ? 'ACTIVED' : 'LOCKED'
            }
            getValueProps={(value) => ({
              checked: value === 'ACTIVED'
            })}
          >
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Khóa"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default Add