import React, { useState, useMemo } from 'react'
import { Button, Modal, Form, Input, Select, Switch, Row, Col } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import UserHeader from '../../components/user/UserHeader'
import UserFilter from '../../components/user/UserFilter'
import UserTable from '../../components/user/UserTable'
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
  
  // Watch role value - phải sau form
  const roleValue = Form.useWatch('role', form)

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

    <Modal
  title={isEditMode ? 'Cập nhật người dùng' : 'Thêm người dùng'}
  open={isModalOpen}
  footer={null}
  onCancel={handleCancel}
>

<Form
  form={form}
  layout="vertical"
  onFinish={handleSubmit}
  initialValues={{ role: 'student', isActive: true }}
>

  {/* USERNAME */}
  <Form.Item
    label="Tên đăng nhập"
    name="username"
    rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}
  >
    <Input disabled={isEditMode} />
  </Form.Item>

  {/* EMAIL */}
  <Form.Item
    label="Email"
    name="email"
    rules={[{ required: true, message: 'Nhập email' }]}
  >
    <Input />
  </Form.Item>

  {/* FULLNAME */}
  <Form.Item
    label="Họ và tên"
    name="fullName"
    rules={[{ required: true, message: 'Nhập họ và tên' }]}
  >
    <Input />
  </Form.Item>

  {/* ROLE */}
  <Form.Item
    label="Vai trò"
    name="role"
    rules={[{ required: true }]}
  >
    <Select
      options={[
        { value: 'admin', label: 'Quản trị viên' },
        { value: 'teacher', label: 'Giáo viên' },
        { value: 'student', label: 'Học sinh' }
      ]}
    />
  </Form.Item>

  {/* STATUS */}
  <Form.Item
    label="Trạng thái"
    name="isActive"
    valuePropName="checked"
  >
    <Switch
      checkedChildren="Hoạt động"
      unCheckedChildren="Khóa"
    />
  </Form.Item>

  {/* CLASS - chỉ hiện khi student */}
  {roleValue === 'student' && (
    <Form.Item
      label="Lớp"
      name="className"
      rules={[{ required: true, message: 'Chọn lớp' }]}
    >
      <Select
        options={[
          { value: 'Lớp 10A1', label: 'Lớp 10A1' },
          { value: 'Lớp 10A2', label: 'Lớp 10A2' },
          { value: 'Lớp 11A1', label: 'Lớp 11A1' }
        ]}
      />
    </Form.Item>
  )}

  {/* SUBJECT - chỉ hiện khi teacher */}
  {roleValue === 'teacher' && (
    <Form.Item
      label="Môn"
      name="subject"
      rules={[{ required: true, message: 'Chọn môn' }]}
    >
      <Select
        options={[
          { value: 'Toán', label: 'Toán' },
          { value: 'Văn', label: 'Văn' }
        ]}
      />
    </Form.Item>
  )}

  <Button
    type="primary"
    htmlType="submit"
    loading={loading}
  >
    {isEditMode ? 'Cập nhật' : 'Thêm'}
  </Button>
</Form>
</Modal>

    </div>
  )
}
export default User
