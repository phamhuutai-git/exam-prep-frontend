import React from 'react'
import { Table, Button, Tag, Switch, Space, Popconfirm, Pagination } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

const UserTable = ({
  data = [],
  loading,
  onEdit,
  onToggleStatus,
  page = 0,
  total = 0,
  onPageChange
}) => {
  const getRoleTag = (role) => {
    const colors = {
      admin: 'blue',
      teacher: 'green',
      student: 'orange'
    }

    const labels = {
      admin: 'Quản trị viên',
      teacher: 'Giáo viên',
      student: 'Học sinh'
    }

    return <Tag color={colors[role]}>{labels[role]}</Tag>
  }

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => page * 5 + index + 1
    },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Họ tên', dataIndex: 'fullName' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: getRoleTag
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status, record) => {
        const isActive = status === 'ACTIVED'

        return (
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
      }
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faPencil} />}
          onClick={() => onEdit(record)}
        />
      )
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

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

export default UserTable