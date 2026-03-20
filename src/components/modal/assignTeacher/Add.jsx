import React, { useEffect } from 'react'
import { Modal, Form, Select, Table } from 'antd'
import { toast } from 'react-toastify'

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

  // 👇 lấy danh sách (nhưng chỉ cho 1 phần tử)
  const selectedTeacherIds = Form.useWatch('teacherIds', form) || []

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        teacherIds: initialValues.teacherIds || []
      })
    } else {
      form.resetFields()
    }
  }, [open, initialValues, form])

  const handleOk = () => {
    form.validateFields().then(values => {
      if (!values.teacherIds || !values.teacherIds.length) {
        toast.warning('Vui lòng chọn giáo viên!')
        return
      }

      // 👉 chỉ lấy 1 thằng
      onSubmit({
        ...values,
        teacherId: values.teacherIds[0]
      })

      form.resetFields()
    })
  }

  const columns = [
    {
      title: 'STT',
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Username',
      dataIndex: 'username'
    },
    {
      title: 'Họ và tên GV',
      dataIndex: 'name'
    }
  ]

  return (
    <Modal
      title={isEditMode ? 'Sửa phân công' : 'Thêm phân công'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">

        {/* chọn lớp */}
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

        {/* hidden field */}
        <Form.Item name="teacherIds" hidden />

        {/* table */}
        <Table
          columns={columns}
          dataSource={teachers}
          rowKey="id"
          pagination={false}
          loading={loading}
          scroll={{ y: 300 }}

          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedTeacherIds,

            // 👇 chỉ giữ 1 cái
            onChange: (selectedRowKeys) => {
              const last = selectedRowKeys.slice(-1)
              form.setFieldsValue({ teacherIds: last })
            },

            // 👇 disable các checkbox khác khi đã chọn 1
            getCheckboxProps: (record) => ({
              disabled:
                selectedTeacherIds.length > 0 &&
                !selectedTeacherIds.includes(record.id)
            })
          }}

          // 👇 click row để chọn luôn (UX xịn)
          onRow={(record) => ({
            onClick: () => {
              const current = selectedTeacherIds

              if (current.includes(record.id)) {
                form.setFieldsValue({ teacherIds: [] })
              } else {
                form.setFieldsValue({ teacherIds: [record.id] })
              }
            }
          })}
        />

      </Form>
    </Modal>
  )
}

export default Add