import React, { useState } from 'react'
import AssignTeacherHeader from '../../components/assignTeacher/AssignTeacherHeader'
import AssignTeacherFilter from '../../components/assignTeacher/AssignTeacherFilter'

const AssignTeacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') // ✅ thêm

  return (
    <div style={{ padding: 20 }}>
      <AssignTeacherHeader
        title="Phân công giáo viên"
        description="Quản lý việc phân công giáo viên cho các lớp học"
        buttonText="Thêm phân công"
        handleAdd={() => setIsModalOpen(true)}
      />
      <AssignTeacherFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClear={() => setSearchTerm('')}
      />
    </div>
  )
}

export default AssignTeacher