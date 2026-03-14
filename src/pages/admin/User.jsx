import React, { useState, useMemo } from 'react'
import { Button, Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import UserHeader from '../../components/user/UserHeader'
import UserFilter from '../../components/user/UserFilter'
import UserTable from '../../components/user/UserTable'
import Add from '../../components/modal/user/Add'
// Mock data - Dữ liệu mẫu
const initialUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@vti.com',
    fullName: 'Quản trị viên',
    role: 'admin',
    isActive: true,
    className: '-',
    subject: '-',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    username: 'teacher1',
    email: 'teacher1@vti.com',
    fullName: 'Nguyễn Văn A',
    role: 'teacher',
    isActive: true,
    className: '-',
    subject: 'Toán',
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    username: 'teacher2',
    email: 'teacher2@vti.com',
    fullName: 'Trần Thị B',
    role: 'teacher',
    isActive: false,
    className: '-',
    subject: 'Văn',
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    username: 'student1',
    email: 'student1@vti.com',
    fullName: 'Lê Văn C',
    role: 'student',
    isActive: true,
    className: 'Lớp 10A1',
    subject: '-',
    createdAt: '2024-03-01'
  }
]

const User = () => {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [form] = Form.useForm()
  


  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  // Filtered users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = !roleFilter || user.role === roleFilter
      
      const matchesClass = !classFilter || user.className.includes(classFilter)
      
      const matchesSubject = !subjectFilter || user.subject.includes(subjectFilter)
      
      return matchesSearch && matchesRole && matchesClass && matchesSubject
    })
  }, [users, searchTerm, roleFilter, classFilter, subjectFilter])

  const handleAdd = () => {
    setIsEditMode(false)
    setSelectedUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setIsEditMode(true)
    setSelectedUser(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setLoading(true)
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== id))
      setLoading(false)
      toast.success('Xóa người dùng thành công!')
    }, 500)
  }

  const handleSubmit = (values) => {
    setLoading(true)

    setTimeout(() => {

      const currentDate = new Date().toISOString().split('T')[0]

      if (isEditMode) {

        setUsers(users.map(user =>
          user.id === selectedUser.id ? { ...user, ...values } : user
        ))

        toast.success('Cập nhật người dùng thành công!')
      }

      else {

        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...values,
          isActive: true,
          createdAt: currentDate,
          className: '-',
          subject: '-'
        }

        setUsers([...users, newUser])
        toast.success('Thêm người dùng thành công!')
      }

      setLoading(false)
      setIsModalOpen(false)
      form.resetFields()

    }, 500)
  }

  const handleToggleStatus = (record) => {
    setLoading(true)

    setTimeout(() => {

      setUsers(users.map(user =>
        user.id === record.id
          ? { ...user, isActive: !user.isActive }
          : user
      ))

      setLoading(false)

      toast.success(
        `Đã ${record.isActive ? 'vô hiệu hóa' : 'kích hoạt'} người dùng!`
      )

    }, 300)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  return (

    <div style={{ padding: 24 }}>

      {/* Header + Button cùng hàng */}
      <UserHeader
        title="Quản lý người dùng"
        description="Tạo, chỉnh sửa, xóa và quản lý trạng thái người dùng"
        buttonText="Thêm người dùng"
        handleAdd={handleAdd}
      />

      {/* Search and Filter Section */}
      <UserFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
      />
      <UserTable
        data={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
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
export default User
