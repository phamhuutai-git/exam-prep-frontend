import React from 'react'
import { Table, Button, Space, Popconfirm, Pagination, Tag } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

const AssignTeacherTable = ({
  data = [],
  onEdit,
  onDelete,
  page = 0,
  total = 0,
  onPageChange
}) => {

  const columns = [
    {
      title: 'STT',
      align: 'center',
      render: (_, __, index) => page * 5 + index + 1
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className'
    },
    {
      title: 'Tài khoản GV',
      dataIndex: 'teacherUsername',
      key: 'teacherUsername',
      render: (username) => <Tag color="blue">{username}</Tag>
    },
    {
      title: 'Tên giáo viên',
      dataIndex: 'teacherName',
      key: 'teacherName'
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          {/* Sửa */}
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faPencil} />}
            onClick={() => onEdit(record)}
          />

          {/* Xóa */}
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faTrash} />}
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={false} // ❗ dùng pagination riêng
      />

      {/* Pagination riêng */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination
          current={page + 1}
          total={total}
          pageSize={5}
          onChange={(p) => onPageChange && onPageChange(p - 1)}
        />
      </div>
    </>
  )
}

export default AssignTeacherTable