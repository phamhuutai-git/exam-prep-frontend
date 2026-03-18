import React from 'react'
import { Table, Button, Tag, Switch, Space, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
const UserTable = ({ data, loading, onEdit, onDelete, onToggleStatus}) => {
  // Helper function to render role tag
  const getRoleTag = (role) => {
    const roleColors = {
      admin: 'blue',
      teacher: 'green',
      student: 'orange'
    }
    const roleLabels = {
      admin: 'Quản trị viên',
      teacher: 'Giáo viên',
      student: 'Học sinh'
    }
    return <Tag color={roleColors[role]}>{roleLabels[role]}</Tag>
  }
  // Columns definition
  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username'
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: (role) => getRoleTag(role)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive, record) => (
        <Popconfirm
          title={isActive ? 'Vô hiệu hóa người dùng?' : 'Kích hoạt người dùng?'}
          onConfirm={() => onToggleStatus(record)}
        >
          <Switch
            checked={isActive}
            checkedChildren="Hoạt động"
            unCheckedChildren="Khóa"
          />
        </Popconfirm>
      )
    },
  
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt'
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
            title="Xóa người dùng?"
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
export default UserTable
