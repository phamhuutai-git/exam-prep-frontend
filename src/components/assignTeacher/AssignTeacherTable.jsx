import React from 'react'
import { Table, Button, Space, Pagination } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPlus,
  faUserGraduate,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons'

const AssignTeacherTable = ({
  data = [],
  page = 0,
  total = 0,
  onPageChange,
  onAddTeacher,
  onViewTeachers,
  onViewStudents,
  loading
}) => {

  const columns = [
    {
      title: 'STT',
      align: 'center',
      render: (_, __, index) => page * 5 + index + 1
    },
    {
      title: 'Lớp',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Số sinh viên',
      dataIndex: 'studentCount',
      key: 'studentCount'
    },
    {
      title: 'Số giáo viên',
      dataIndex: 'teacherCount',
      key: 'teacherCount'
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          {/* Thêm giáo viên */}
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            onClick={() => onAddTeacher(record)}
          />

          {/* Xem giáo viên */}
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
            onClick={() => onViewTeachers(record)}
          />

          {/* Xem sinh viên */}
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faUserGraduate} />}
            onClick={() => onViewStudents(record)}
          />
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
        pagination={false}
        loading={loading}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination
          current={page + 1}
          total={total}
          pageSize={5}
          onChange={(p) => onPageChange(p - 1)}
        />
      </div>
    </>
  )
}

export default AssignTeacherTable