import React, { useEffect } from 'react'
import { Modal, Form, Select, Input } from 'antd'

const Add = ({
  open,
  onCancel,
  onSubmit,
  loading,
  classes = [],
  teachers = [],
  isEditMode = false,
  initialValues = null
}) => {

  const [form] = Form.useForm()

  // 👇 Lắng nghe teacherId
  const selectedTeacherId = Form.useWatch('teacherId', form)

  // 👇 tìm teacher
  const selectedTeacher = teachers.find(
    t => t.id === selectedTeacherId
  )

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [open, initialValues, form])

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={isEditMode ? 'Sửa phân công' : 'Thêm phân công'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      forceRender
    >
      <Form form={form} layout="vertical">

        {/* Chọn lớp */}
        <Form.Item
          name="classId"
          label="Chọn lớp"
          rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}
        >
          <Select placeholder="Chọn lớp">
            {classes.map(c => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn tài khoản giáo viên */}
        <Form.Item
          name="teacherId"
          label="Chọn tài khoản giáo viên"
          rules={[{ required: true, message: 'Vui lòng chọn giáo viên' }]}
        >
          <Select placeholder="Chọn tài khoản">
            {teachers.map(t => (
              <Select.Option key={t.id} value={t.id}>
                {t.username || t.name} {/* 👈 có thể là username */}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Hiển thị tên giáo viên */}
        <Form.Item label="Tên giáo viên">
          <Input
            value={selectedTeacher?.name || ''}
            placeholder="Tên giáo viên sẽ hiển thị"
            disabled
          />
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default Add