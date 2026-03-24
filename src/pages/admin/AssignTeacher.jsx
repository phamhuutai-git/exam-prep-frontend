import React, { useState, useEffect } from 'react'
import AssignTeacherHeader from '../../components/assignTeacher/AssignTeacherHeader'
import AssignTeacherFilter from '../../components/assignTeacher/AssignTeacherFilter'
import AssignTeacherTable from '../../components/assignTeacher/AssignTeacherTable'
import { toast } from 'react-toastify'
import Add from '../../components/modal/assignTeacher/Add'
import ViewTeacher from '../../components/modal/assignTeacher/ViewTeacher'
import ViewStudent from '../../components/modal/assignTeacher/ViewStudent'

import {
  getTeachers,
  getStudentsByClass,
  getTeachersByClass
} from '../../services/userService.js'

import {
  getClasses,
  addTeachersToClass
} from '../../services/classes.js'

const AssignTeacher = () => {
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [teachers, setTeachers] = useState([])

  const [classTeachers, setClassTeachers] = useState([])
  const [students, setStudents] = useState([])

  const [teacherLoading, setTeacherLoading] = useState(false)
  const [classLoading, setClassLoading] = useState(false)
  const [teacherViewLoading, setTeacherViewLoading] = useState(false)
  const [studentLoading, setStudentLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  const [viewStudentDrawer, setViewStudentDrawer] = useState(false)
  const [viewTeacherDrawer, setViewTeacherDrawer] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)

  // ================= LOAD CLASSES =================
  const fetchClasses = async () => {
    try {
      setClassLoading(true)

      const res = await getClasses({
        page: page,
        size: 5
      })

      const raw = res.data?.data?.content || []

      setTotal(res.data?.data?.totalElements || 0)

      const classList = raw.map(item => ({
        id: item.id,
        name: item.name,
        studentCount: item.studentCount || 0,
        teacherCount: item.teacherCount || 0
      }))

      setData(classList)

    } catch (err) {
      console.error(err)
      toast.error('Lỗi load danh sách lớp!')
    } finally {
      setClassLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [page])

  // ================= OPEN MODAL =================
  const handleOpenAddTeacher = async (record) => {
    setIsModalOpen(true)

    try {
      setTeacherLoading(true)

      const [teacherRes, classTeacherRes] = await Promise.all([
        getTeachers(),
        getTeachersByClass(record.id)
      ])

      const teacherList =
        teacherRes.data?.data?.content ||
        teacherRes.data?.data ||
        []

      const classTeacherList =
        classTeacherRes.data?.data?.content ||
        classTeacherRes.data?.data ||
        []

      setTeachers(teacherList)

      setSelectedClass({
        ...record,
        teachers: classTeacherList
      })

    } catch (err) {
      console.error(err)
      toast.error('Lỗi load giáo viên!')
    } finally {
      setTeacherLoading(false)
    }
  }

  // ================= SUBMIT =================
  const handleSubmit = async (teacherIds) => {
    if (!selectedClass) return

    try {
      setTeacherLoading(true)

      await addTeachersToClass(selectedClass.id, teacherIds)

      // reload teacher list
      const res = await getTeachersByClass(selectedClass.id)

      const updatedTeachers =
        res.data?.data?.content ||
        res.data?.data ||
        []

      // update UI
      setData(prev =>
        prev.map(cls =>
          cls.id === selectedClass.id
            ? {
                ...cls,
                teacherCount: updatedTeachers.length // ✅ FIX QUAN TRỌNG
              }
            : cls
        )
      )

      toast.success('Phân công giáo viên thành công')

      setIsModalOpen(false)
      setSelectedClass(null)

    } catch (err) {
      console.error(err)
      toast.error('Lỗi phân công giáo viên!')
    } finally {
      setTeacherLoading(false)
    }
  }

  // ================= VIEW TEACHERS =================
  const handleViewTeachers = async (record) => {
    setCurrentRecord(record)
    setViewTeacherDrawer(true)

    try {
      setTeacherViewLoading(true)

      const res = await getTeachersByClass(record.id)

      const teacherList =
        res.data?.data?.content ||
        res.data?.data ||
        []

      setClassTeachers(teacherList)

    } catch (err) {
      toast.error('Lỗi load giáo viên!' + err)
    } finally {
      setTeacherViewLoading(false)
    }
  }

  // ================= VIEW STUDENTS =================
  const handleViewStudents = async (record) => {
    setCurrentRecord(record)
    setViewStudentDrawer(true)

    try {
      setStudentLoading(true)

      const res = await getStudentsByClass(record.id)

      const studentList =
        res.data?.data?.content ||
        res.data?.data ||
        []

      setStudents(studentList)

    } catch (err) {
      toast.error('Lỗi load sinh viên!' + err)
    } finally {
      setStudentLoading(false)
    }
  }

  // ================= FILTER =================
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ padding: 20 }}>
      <AssignTeacherHeader
        title="Phân công giáo viên"
        description="Quản lý việc phân công giáo viên"
      />

      <AssignTeacherFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClear={() => setSearchTerm('')}
      />

      <AssignTeacherTable
        data={filteredData}
        page={page}
        total={total}
        onPageChange={setPage}
        onAddTeacher={handleOpenAddTeacher}
        onViewTeachers={handleViewTeachers}
        onViewStudents={handleViewStudents}
        loading={classLoading}
      />

      <ViewTeacher
        open={viewTeacherDrawer}
        classInfo={currentRecord}
        teachers={classTeachers}
        loading={teacherViewLoading}
        onClose={() => setViewTeacherDrawer(false)}
      />

      <ViewStudent
        open={viewStudentDrawer}
        classInfo={currentRecord}
        students={students}
        loading={studentLoading}
        onClose={() => setViewStudentDrawer(false)}
      />

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