import React, { useState } from 'react'
import AssignTeacherHeader from '../../components/assignTeacher/AssignTeacherHeader'
import AssignTeacherFilter from '../../components/assignTeacher/AssignTeacherFilter'
import AssignTeacherTable from '../../components/assignTeacher/AssignTeacherTable'
import { toast } from 'react-toastify'
import Add from '../../components/modal/assignTeacher/Add'

const AssignTeacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState([
    {
      id: 1,
      classId: 1,
      className: 'Lớp 10A1',
      teacherId: 1,
      teacherName: 'Nguyễn Văn A'
    }
  ])

  const classes = [
    { id: 1, name: 'Lớp 10A1' },
    { id: 2, name: 'Lớp 11A2' }
  ]

  const teachers = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' }
  ]

  // 🔥 ADD + EDIT
  const handleSubmit = (values) => {
  setLoading(true)

  const classObj = classes.find(c => c.id === values.classId)
  const teacherObj = teachers.find(t => t.id === values.teacherId)

  setTimeout(() => {
    if (isEditMode) {
      // ✅ UPDATE
      setData(prev =>
        prev.map(item =>
          item.id === editingRecord.id
            ? {
                ...item,
                classId: values.classId,
                className: classObj?.name,
                teacherId: values.teacherId,
                teacherName: teacherObj?.name
              }
            : item
        )
      )

      toast.success('Cập nhật phân công thành công 🎉') // ✅ thêm dòng này

    } else {
      // ❌ Không cho trùng lớp
      const isExist = data.some(item => item.classId === values.classId)
      if (isExist) {
        toast.error('Lớp này đã có giáo viên!')
        setLoading(false)
        return
      }

      // ✅ ADD
      const newItem = {
        id: Date.now(),
        classId: values.classId,
        className: classObj?.name,
        teacherId: values.teacherId,
        teacherName: teacherObj?.name
      }

      setData(prev => [...prev, newItem])

      toast.success('Thêm phân công thành công 🎉') // ✅ thêm dòng này
    }

    setLoading(false)
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingRecord(null)
  }, 500)
}

  // ✅ DELETE
  const handleDelete = (id) => {
  setData(prev => prev.filter(item => item.id !== id))

  toast.success('Xóa phân công thành công')
}

  // ✅ EDIT
  const handleEdit = (record) => {
    setEditingRecord({
      id: record.id,
      classId: record.classId,
      teacherId: record.teacherId
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // ✅ ADD BUTTON
  const handleAdd = () => {
    setIsEditMode(false)
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  // 🔍 FILTER
  const filteredData = data.filter(item =>
    item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ padding: 20 }}>
      <AssignTeacherHeader
        title="Phân công giáo viên"
        description="Quản lý việc phân công giáo viên cho các lớp học"
        buttonText="Thêm phân công"
        handleAdd={handleAdd}
      />

      <AssignTeacherFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClear={() => setSearchTerm('')}
      />

      <AssignTeacherTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Add
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
        classes={classes}
        teachers={teachers}
        isEditMode={isEditMode}
        initialValues={editingRecord}
      />
    </div>
  )
}

export default AssignTeacher