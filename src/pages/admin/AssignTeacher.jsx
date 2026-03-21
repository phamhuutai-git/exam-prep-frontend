import React, { useState } from 'react'
import AssignTeacherHeader from '../../components/assignTeacher/AssignTeacherHeader'
import AssignTeacherFilter from '../../components/assignTeacher/AssignTeacherFilter'
import AssignTeacherTable from '../../components/assignTeacher/AssignTeacherTable'
import { toast } from 'react-toastify'
import Add from '../../components/modal/assignTeacher/Add'

import { getTeachers } from '../../services/userService.js'

const AssignTeacher = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)

  // loading riêng
  const [teacherLoading, setTeacherLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  const [selectedClass, setSelectedClass] = useState(null)

  // ✅ DATA CLASS (demo, sau này thay bằng API)
  const [data, setData] = useState([
    {
      id: 1,
      name: 'Lớp 10A1',
      students: [
        { id: 1, name: 'SV 1' },
        { id: 2, name: 'SV 2' }
      ],
      teachers: [
        { id: 1, username: 'teacherA', firstName: 'Nguyễn', lastName: 'A' }
      ]
    },
    {
      id: 2,
      name: 'Lớp 11A2',
      students: [],
      teachers: []
    }
  ])

  // ✅ danh sách teacher từ API
  const [teachers, setTeachers] = useState([])

  // ================= OPEN MODAL =================
  const handleOpenAddTeacher = async (record) => {
    setSelectedClass(record)
    setIsModalOpen(true)

    try {
      setTeacherLoading(true)

      const res = await getTeachers()

      // ⚠️ tùy backend (content hoặc data)
      const teacherList =
        res.data?.data?.content ||
        res.data?.data ||
        []

      setTeachers(teacherList)

    } catch (err) {
      console.error(err)
      toast.error('Lỗi load danh sách giáo viên!')
    } finally {
      setTeacherLoading(false)
    }
  }

  // ================= SUBMIT =================
  const handleSubmit = (teacherIds) => {
    setTeacherLoading(true)

    setTimeout(() => {

      setData(prev =>
        prev.map(cls => {
          if (cls.id !== selectedClass.id) return cls

          // 🔥 replace danh sách teacher
          const newTeachers = teachers.filter(t =>
            teacherIds.includes(t.id)
          )

          return {
            ...cls,
            teachers: newTeachers
          }
        })
      )

      toast.success('Cập nhật giáo viên thành công 🎉')

      setTeacherLoading(false)
      setIsModalOpen(false)
      setSelectedClass(null)

    }, 300)
  }

  // ================= VIEW =================
  const handleViewTeachers = (record) => {
    const names = record.teachers
      .map(t => `${t.firstName} ${t.lastName}`)
      .join(', ') || 'Không có'

    toast.info(`Giáo viên: ${names}`)
  }

  const handleViewStudents = (record) => {
    const names = record.students
      .map(s => s.name)
      .join(', ') || 'Không có'

    toast.info(`Sinh viên: ${names}`)
  }

  // ================= FILTER =================
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ================= PAGINATION =================
  const pageSize = 5
  const paginatedData = filteredData.slice(
    page * pageSize,
    page * pageSize + pageSize
  )

  return (
    <div style={{ padding: 20 }}>

      <AssignTeacherHeader
        title="Phân công giáo viên"
        description="Quản lý việc phân công giáo viên"
        handleAdd={() => toast.info('Chọn lớp rồi bấm +')}
      />

      <AssignTeacherFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClear={() => setSearchTerm('')}
      />

      <AssignTeacherTable
        data={paginatedData}
        page={page}
        total={filteredData.length}
        onPageChange={setPage}
        onAddTeacher={handleOpenAddTeacher}
        onViewTeachers={handleViewTeachers}
        onViewStudents={handleViewStudents}
      />

      {/* ✅ MODAL */}
      <Add
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={teacherLoading}
        users={teachers}
        currentClassTeacherIds={
          selectedClass?.teachers?.map(t => t.id) || []
        }
      />

    </div>
  )
}

export default AssignTeacher