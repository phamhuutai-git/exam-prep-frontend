import React from 'react'
import { Modal, Table, Spin } from 'antd'

const ViewTeacher = ({
  open = false,
  classInfo = null,
  teachers = [],      // ✅ nhận từ props (API)
  loading = false,    // ✅ loading
  onClose
}) => {

  const columns = [
    {
      title: 'STT',
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => text || '---'
    },
    {
      title: 'Họ và tên',
      key: 'fullName',
      render: (_, record) =>
        `${record.firstName || ''} ${record.lastName || ''}`.trim() || '---'
    }
  ]

  return (
    <Modal
      title={`Giáo viên lớp ${classInfo?.name || 'Không xác định'}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {/* Tổng số */}
      <p>
        <strong>Số giáo viên: </strong>
        {teachers.length}
      </p>

      {/* Table + Loading */}
      <Spin spinning={loading}>
        <Table
          dataSource={teachers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Chưa có giáo viên' }}
        />
      </Spin>
    </Modal>
  )
}
export default ViewTeacher