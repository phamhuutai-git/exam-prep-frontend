import React, { useState, useMemo } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import AssignTeacherHeader from '../../components/assignTeacher/AssignTeacherHeader'
import AssignTeacherFilter from '../../components/assignTeacher/AssignTeacherFilter'
import AssignTeacherTable from '../../components/assignTeacher/AssignTeacherTable'
import AddAssignTeacher from '../../components/modal/assignTeacher/Add'

// Mock data
const initialAssignments = [
  {
    id: 1,
    classId: 1,
    className: '10A1',
    teacherId: 'GV01',
    teacherName: 'teacher1',
    subjectName: 'Toán'
  },
  {
    id: 2,
    classId: 1,
    className: '10A1',
    teacherId: 'GV02',
    teacherName: 'teacher2',
    subjectName: 'Văn'
  }
]

const mockClasses = [
  { id: 1, name: '10A1' },
  { id: 2, name: '11B2' },
  { id: 3, name: '12A1' }
]

const mockTeachers = [
  { id: 1, teacherId: 'GV01', username: 'teacher1' },
  { id: 2, teacherId: 'GV02', username: 'teacher2' },
  { id: 3, teacherId: 'GV03', username: 'teacher3' }
]

const mockSubjects = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Văn' },
  { id: 3, name: 'Anh' },
  { id: 4, name: 'Lý' }
]

const AssignTeacher = () => {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [form] = Form.useForm()

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [teacherFilter, setTeacherFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = !searchTerm ||
        assignment.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesClass = !classFilter || assignment.className === classFilter
      const matchesTeacher = !teacherFilter || assignment.teacherName === teacherFilter
      const matchesSubject = !subjectFilter || assignment.subjectName === subjectFilter
      
      return matchesSearch && matchesClass && matchesTeacher && matchesSubject
    })
  }, [assignments, searchTerm, classFilter, teacherFilter, subjectFilter])

  const handleAdd = () => {
    setIsEditMode(false)
    setSelectedAssignment(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setIsEditMode(true)
    setSelectedAssignment(record)
    form.setFieldsValue({
      classId: record.classId,
      teacherCode: record.teacherId,
      subjectId: mockSubjects.find(s => s.name === record.subjectName)?.id
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setLoading(true)
    setTimeout(() => {
      setAssignments(assignments.filter(a => a.id !== id))
      setLoading(false)
      toast.success('Xóa phân công thành công!')
    }, 500)
  }

  const handleSubmit = (values) => {
    setLoading(true)
    setTimeout(() => {
      const classInfo = mockClasses.find(c => c.id === values.classId)
      const teacherInfo = mockTeachers.find(t => t.teacherId === values.teacherCode)
      if (!teacherInfo) {
        toast.error('Mã giáo viên không tồn tại!')
        setLoading(false)
        return
      }
      const subjectInfo = mockSubjects.find(s => s.id === values.subjectId)

      const assignmentData = {
        classId: values.classId,
        className: classInfo.name,
        teacherId: values.teacherCode,
        teacherName: teacherInfo.username,
        subjectName: subjectInfo.name
      }

      if (isEditMode && selectedAssignment) {
        setAssignments(assignments.map(a =>
          a.id === selectedAssignment.id ? { ...a, ...assignmentData } : a
        ))
        toast.success('Cập nhật phân công thành công!')
      } else {
        const newAssignment = {
          id: Date.now(),
          ...assignmentData
        }
        setAssignments([...assignments, newAssignment])
        toast.success('Gán giáo viên thành công!')
      }

      setLoading(false)
      setIsModalOpen(false)
      form.resetFields()
    }, 1000)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <AssignTeacherHeader
        title="Gán giáo viên cho lớp"
        description="Quản lý phân công giáo viên giảng dạy cho các lớp học"
        buttonText="Gán giáo viên"
        handleAdd={handleAdd}
      />

      {/* Filter */}
      <AssignTeacherFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        teacherFilter={teacherFilter}
        setTeacherFilter={setTeacherFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
      />

      {/* Table */}
      <AssignTeacherTable
        data={filteredAssignments}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <AddAssignTeacher
        open={isModalOpen}
        isEditMode={isEditMode}
        form={form}
        loading={loading}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        classes={mockClasses}
        teachers={mockTeachers}
        subjects={mockSubjects}
      />
    </div>
  )
}

export default AssignTeacher

