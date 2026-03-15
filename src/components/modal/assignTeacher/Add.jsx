import React, { useState, useEffect } from 'react'
import { Modal, Form, Select, Button, Space, Input, Alert } from 'antd'

const AddAssignTeacher = ({
  open,
  isEditMode,
  form,
  loading,
  onCancel,
  onSubmit,
  classes = [],
  teachers = [],
  subjects = []
}) => {
  const [teacherPreview, setTeacherPreview] = useState(null)

  const updateTeacherPreview = (teacherCode) => {
    if (!teacherCode) {
      setTeacherPreview(null)
      return
    }
    const foundTeacher = teachers.find(t => t.teacherId === teacherCode)
    setTeacherPreview(foundTeacher || null)
  }

  useEffect(() => {
    const teacherCode = form.getFieldValue('teacherCode')
    if (teacherCode) {
      updateTeacherPreview(teacherCode)
    }
  }, [open, teachers, form])

  const validateTeacherCode = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập mã giáo viên!'))
    }
    const foundTeacher = teachers.find(t => t.teacherId === value)
    if (!foundTeacher) {
      return Promise.reject(new Error('Mã giáo viên không tồn tại!'))
    }
    return Promise.resolve()
  }

  return (
    <Modal
      title={isEditMode ? 'Cập nhật phân công' : 'Gán giáo viên cho lớp'}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="classId"
          label="Lớp học"
          rules={[{ required: true, message: 'Vui lòng chọn lớp!' }]}
        >
          <Select placeholder="Chọn lớp">
            {classes.map(cls => (
              <Select.Option key={cls.id} value={cls.id}>
                {cls.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="teacherCode"
          label="Mã giáo viên"
          rules={[{ validator: validateTeacherCode }]}
          help={
            teacherPreview ? (
              <div style={{ color: 'green' }}>
                <strong>Giáo viên:</strong> {teacherPreview.username}
              </div>
            ) : (
              <div style={{ color: 'orange' }}>Nhập mã để xem thông tin GV</div>
            )
          }
        >
          <Input 
            placeholder="Nhập mã GV (VD: GV01)"
            onChange={(e) => {
              updateTeacherPreview(e.target.value)
            }}
          />
        </Form.Item>

        <Form.Item
          name="subjectId"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
        >
          <Select placeholder="Chọn môn">
            {subjects.map(sub => (
              <Select.Option key={sub.id} value={sub.id}>
                {sub.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onCancel} disabled={loading}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? 'Cập nhật' : 'Gán giáo viên'}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddAssignTeacher
