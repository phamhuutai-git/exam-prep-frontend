import React, { useState, useMemo, useEffect } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import UserHeader from '../../components/user/UserHeader'
import UserFilter from '../../components/user/UserFilter'
import UserTable from '../../components/user/UserTable'
import Add from '../../components/modal/user/Add'
import { getUsers, unlockUser, lockUser } from '../../services/userService.js'
const User = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
const [total, setTotal] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [form] = Form.useForm()

  // 🔍 Search + Role filter
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const fetchUsers = async (pageParam = page) => {
  setLoading(true)
  try {
    const res = await getUsers({ page: pageParam })

    const rawData = res.data?.data?.content || []

    const mappedData = rawData.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      role: user.role?.toLowerCase(),
      isActive: user.status === 'ACTIVED',
      createdAt: user.createdDate
        ? user.createdDate.split('T')[0]
        : ''
    }))

    setUsers(mappedData)

    // 🔥 QUAN TRỌNG
    setTotal(res.data?.data?.totalElements || 0)

  } catch (error) {
    toast.error('Lỗi khi tải danh sách!'+ error.message)
  } finally {
    setLoading(false)
  }
}

  // ================= FILTER =================
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole =
        !roleFilter || user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  // ================= CRUD =================
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
        setUsers(
          users.map(user =>
            user.id === selectedUser.id
              ? { ...user, ...values }
              : user
          )
        )
        toast.success('Cập nhật người dùng thành công!')
      } else {
        const newUser = {
          id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
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

  // 🔄 Toggle trạng thái
  const handleToggleStatus = async (record) => {
    setLoading(true)

    const newIsActive = !record.isActive

    // Optimistic update
    setUsers(
      users.map(user =>
        user.id === record.id
          ? { ...user, isActive: newIsActive }
          : user
      )
    )

    try {
      if (newIsActive) {
        await unlockUser(record.id)
      } else {
        await lockUser(record.id)
      }

      toast.success(
        `Đã ${newIsActive ? 'kích hoạt' : 'vô hiệu hóa'} người dùng!`
      )
    } catch (error) {
      // rollback nếu lỗi
      setUsers(
        users.map(user =>
          user.id === record.id
            ? { ...user, isActive: record.isActive }
            : user
        )
      )

      toast.error('Lỗi khi thay đổi trạng thái!')
      console.error(error)
    } finally {
      setLoading(false)
      await fetchUsers()
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  // ================= UI =================
  return (
    <div style={{ padding: 24 }}>
      <UserHeader
        title="Quản lý người dùng"
        description="Tạo, chỉnh sửa, xóa và quản lý trạng thái người dùng"
        buttonText="Thêm người dùng"
        handleAdd={handleAdd}
      />

      <UserFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <UserTable
  data={filteredUsers}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleStatus={handleToggleStatus}
  page={page}
  total={total}
  onPageChange={setPage}
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