import React, { useState, useMemo } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import ClassesHeader from '../../components/classes/ClassesHeader'
import ClassesFilter from '../../components/classes/ClassesFilter'
import ClassesTable from '../../components/classes/ClassesTable'
import Add from '../../components/modal/classes/Add'

// Mock data - Dữ liệu mẫu
const initialClasses = [
  {
    id: 1,
    className: 'Lớp Java cơ bản 01',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    className: 'Lớp Toán 10A1',
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    className: 'Lớp Ngữ Văn 11B2',
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    className: 'Lớp Tiếng Anh 12C1',
    isActive: true,
    createdAt: '2024-03-01'
  }
]

const Classes = () => {
  const [classesData, setClassesData] = useState(initialClasses)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [form] = Form.useForm()

  // Search state
  const [searchTerm, setSearchTerm] = useState('')

  // Filtered classes based on search
  const filteredClasses = useMemo(() => {
    return classesData.filter(cls => 
      !searchTerm || 
      cls.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.className.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [classesData, searchTerm])

  const handleAdd = () => {
    setIsEditMode(false)
    setSelectedClass(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setIsEditMode(true)
    setSelectedClass(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setLoading(true)
    setTimeout(() => {
      setClassesData(classesData.filter(cls => cls.id !== id))
      setLoading(false)
      toast.success('Xóa lớp thành công!')
    }, 500)
  }

  const handleSubmit = (values) => {
    setLoading(true)

    setTimeout(() => {
      const currentDate = new Date().toISOString().split('T')[0]

      if (isEditMode) {
        setClassesData(classesData.map(cls =>
          cls.id === selectedClass.id ? { ...cls, ...values } : cls
        ))
        toast.success('Cập nhật lớp thành công!')
      } else {
        const newClass = {
          id: Math.max(...classesData.map(c => c.id)) + 1,
          ...values,
          isActive: true,
          createdAt: currentDate
        }
        setClassesData([...classesData, newClass])
        toast.success('Tạo lớp thành công!')
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
      {/* Header + Button */}
      <ClassesHeader
        title="Quản lý lớp"
        description="Tạo, chỉnh sửa, xóa và quản lý trạng thái lớp"
        buttonText="Tạo lớp"
        handleAdd={handleAdd}
      />

      {/* Search and Filter Section */}
      <ClassesFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <ClassesTable
        data={filteredClasses}
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

export default Classes

