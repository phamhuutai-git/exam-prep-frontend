import React from 'react'
import { Table, Button, Space, Popconfirm, Pagination } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

const SubjectsTable = ({
  data = [],
  loading,
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
      title: 'Tên môn',
      dataIndex: 'subjectName'
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
          />

          <Popconfirm
            title="Xóa môn học?"
            onConfirm={() => onDelete(record.id)}
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
        loading={loading}
        bordered
        pagination={false} // ❗ tắt pagination mặc định
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

export default SubjectsTable