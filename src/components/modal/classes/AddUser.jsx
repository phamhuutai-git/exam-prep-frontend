import React, { useState, useEffect } from 'react'
import { Modal, Table, Button } from 'antd'

const AddUser = ({
  open,
  onCancel,
  onSubmit,
  users = [],
  loading,
  currentClassUserIds = [],
  disabledUserIds = []
}) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // ✅ Sync khi mở modal
  useEffect(() => {
    if (open) {
      setSelectedRowKeys(currentClassUserIds)
    }
  }, [open, currentClassUserIds])

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
   
  ]

  const rowSelection = {
    selectedRowKeys,

    onChange: (keys) => {
      setSelectedRowKeys(keys)
    },

    // ✅ disable user thuộc class khác
    getCheckboxProps: (record) => ({
      disabled: disabledUserIds.includes(record.id)
    })
  }

  const handleSubmit = () => {
    onSubmit(selectedRowKeys)
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