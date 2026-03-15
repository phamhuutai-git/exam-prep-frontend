import React, { useState, useMemo } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import SubjectsHeader from '../../components/subjects/SubjectsHeader'
import SubjectsFilter from '../../components/subjects/SubjectsFilter'
import SubjectsTable from '../../components/subjects/SubjectsTable'
import Add from '../../components/modal/subjects/Add'

// Mock data - Dữ liệu mẫu
const initialSubjects = [
  {
    id: 1,
    subjectName: 'Toán học',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    subjectName: 'Ngữ Văn',
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    subjectName: 'Tiếng Anh',
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    subjectName: 'Vật Lý',
    createdAt: '2024-03-01'
  }
]

const Subjects = () => {
  const [subjectsData, setSubjectsData] = useState(initialSubjects)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [form] = Form.useForm()

  // Search state
  const [searchTerm, setSearchTerm] = useState('')

  // Filtered subjects based on search
  const filteredSubjects = useMemo(() => {
    return subjectsData.filter(subject => 
      !searchTerm || 
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [subjectsData, searchTerm])

  const handleAdd = () => {
    setIsEditMode(false)
    setSelectedSubject(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setIsEditMode(true)
    setSelectedSubject(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setLoading(true)
    setTimeout(() => {
      setSubjectsData(subjectsData.filter(subject => subject.id !== id))
      setLoading(false)
      toast.success('Xóa môn học thành công!')
    }, 500)
  }

  const handleSubmit = (values) => {
    setLoading(true)

    setTimeout(() => {
      const currentDate = new Date().toISOString().split('T')[0]

      if (isEditMode) {
        setSubjectsData(subjectsData.map(subject =>
          subject.id === selectedSubject.id ? { ...subject, ...values } : subject
        ))
        toast.success('Cập nhật môn học thành công!')
      } else {
        const newSubject = {
          id: Math.max(...subjectsData.map(s => s.id)) + 1,
          ...values,
          createdAt: currentDate
        }
        setSubjectsData([...subjectsData, newSubject])
        toast.success('Tạo môn học thành công!')
      }

      setLoading(false)
      setIsModalOpen(false)
      form.resetFields()
    }, 500)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  return (
    <div style={{ padding: 24 }}>
      <SubjectsHeader
        title="Quản lý môn học"
        description="Tạo, chỉnh sửa, xóa môn học"
        buttonText="Tạo môn"
        handleAdd={handleAdd}
      />

      <SubjectsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <SubjectsTable
        data={filteredSubjects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <Add 
        open={isModalOpen}
        isEditMode={isEditMode}
        form={form}
        loading={loading}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Subjects

