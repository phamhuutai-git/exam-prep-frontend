import React from 'react'
import { Modal, Table } from 'antd'
const View = ({ open, onCancel, students = [] }) => {
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
      title: 'Họ và tên',
      dataIndex: 'fullName'
    }
  ]
  return (
    <Modal
      title="Danh sách sinh viên"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  )
}

export default View