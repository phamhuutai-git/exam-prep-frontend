import React, { useState, } from 'react'
import { Modal, Form, Select, Button, Space } from 'antd'
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
          rules={[{ required: true, message: 'Vui lòng chọn giáo viên!' }]}
          help={
            teacherPreview ? (
              <div style={{ color: 'green' }}>
                <strong>Tên GV:</strong> {teacherPreview?.username || ''}
              </div>
            ) : (
              <div style={{ color: 'orange' }}>
                Chọn mã GV để xem thông tin
              </div>
            )
          }
        >
          <Select
            placeholder="Chọn mã giáo viên"
            onChange={updateTeacherPreview}
          >
            {teachers.map(t => (
              <Select.Option key={t.id} value={t.teacherId}>
                {t.teacherId} - {t.username}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subjectId"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
        >
          <Select placeholder="Chọn môn học">
            {subjects.map(s => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
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
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
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

