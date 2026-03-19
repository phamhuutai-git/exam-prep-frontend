import React, { useEffect } from 'react'
import { Modal, Form, Select } from 'antd'

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

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [open, initialValues])

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

        <Form.Item
          name="teacherId"
          label="Chọn giáo viên"
          rules={[{ required: true, message: 'Vui lòng chọn giáo viên' }]}
        >
          <Select placeholder="Chọn giáo viên">
            {teachers.map(t => (
              <Select.Option key={t.id} value={t.id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Add