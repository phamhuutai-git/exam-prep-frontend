import React from 'react'
import { Table, Button, Space, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

const ClassesTable = ({ data, loading, onEdit, onDelete }) => {

  const columns = [
    {
      title: 'STT',
      align: 'center',
      render: (text, record, index) => index + 1
    },

    {
      title: 'Tên lớp',
      dataIndex: 'className'
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt'
    },

    {
      title: 'Hành động',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faPencil} />}
            onClick={() => onEdit(record)}
            title="Sửa"
          />

          <Popconfirm
            title="Xóa lớp?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faTrash} />}
              danger
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      bordered
    />
  )
}

export default ClassesTable