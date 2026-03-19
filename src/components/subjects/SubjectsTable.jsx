import React from 'react'
import { Table, Button, Space, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

const SubjectsTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Tên môn',
      dataIndex: 'subjectName'
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faPencil} />}
            onClick={() => onEdit(record)}
            title="Sửa"
          />
          <Popconfirm
            title="Xóa môn học?"
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

export default SubjectsTable

