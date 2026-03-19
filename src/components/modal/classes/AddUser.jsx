import React, { useState } from 'react'
import { Modal, Table, Button } from 'antd'

const AddUser = ({
  open,
  onCancel,
  onSubmit,
  users = [], // danh sách user truyền từ ngoài
  loading
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

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
    title: 'Tên đăng nhập',
    render: (_, record) =>
      `${record.firstName || ''} ${record.lastName || ''}`
  },
  {
    title: 'Role',
    dataIndex: 'role'
  }
]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys)
  }

  const handleSubmit = () => {
    onSubmit(selectedRowKeys) // trả về list id user đã chọn
    setSelectedRowKeys([])
  }

  return (
    <Modal
      title="Thêm sinh viên vào lớp"
      open={open}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={selectedRowKeys.length === 0}
        >
          Thêm
        </Button>
      ]}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        rowSelection={rowSelection}
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  )
}

export default AddUser