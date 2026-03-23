import React, { useState, useEffect } from 'react'
import { Modal, Table, Button } from 'antd'
const Add = ({
  open,
  onCancel,
  onSubmit,
  users = [], // danh sách giáo viên
  loading,
  currentClassTeacherIds = [],
  disabledTeacherIds = [] // thường teacher KHÔNG cần disable
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // ✅ Sync khi mở modal
  useEffect(() => {
    if (open) {
      setSelectedRowKeys(currentClassTeacherIds)
    }
  }, [open, currentClassTeacherIds])

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
      title: 'Tên giáo viên',
      render: (_, record) =>
        `${record.firstName || ''} ${record.lastName || ''}`
    },
  ]
  const rowSelection = {
    selectedRowKeys,

    onChange: (keys) => {
      setSelectedRowKeys(keys)
    },

    // ⚠️ Teacher thường KHÔNG disable (vì dạy nhiều lớp)
    getCheckboxProps: (record) => ({
      disabled: disabledTeacherIds.includes(record.id)
    })
  }

  const handleSubmit = () => {
    onSubmit(selectedRowKeys)
  }

  return (
    <Modal
      title="Phân công giáo viên"
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
          Lưu
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

export default Add
