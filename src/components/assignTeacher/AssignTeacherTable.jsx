import React from 'react'
import { Table, Button, Space, Popconfirm, Tag } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

const AssignTeacherTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'STT',
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      align: 'center'
    },
    {
      title: 'Mã GV',
      dataIndex: 'teacherId',
      align: 'center'
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacherName',
      align: 'center'
    },
    {
      title: 'Môn',
      dataIndex: 'subjectName',
      render: (subject) => (
        <Tag color="blue">{subject}</Tag>
      )
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
            title="Xóa phân công giáo viên này?"
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

export default AssignTeacherTable

