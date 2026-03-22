import React from 'react'
import { Modal, Table, Spin } from 'antd'

const ViewStudent = ({
  open = false,
  classInfo = null,
  students = [],     // ✅ nhận từ props
  loading = false,  // ✅ loading API
  onClose
}) => {

  // ✅ columns
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
      title={`Sinh viên lớp ${classInfo?.name || 'Không xác định'}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {/* Tổng số */}
      <p>
        <strong>Tổng số: </strong>
        {students.length} sinh viên
      </p>

      {/* Table + Loading */}
      <Spin spinning={loading}>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Chưa có sinh viên' }}
        />
      </Spin>
    </Modal>
  )
}

export default ViewStudent