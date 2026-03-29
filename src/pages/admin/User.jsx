import React, { useState, useMemo, useEffect } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import UserHeader from '../../components/user/UserHeader'
import UserFilter from '../../components/user/UserFilter'
import UserTable from '../../components/user/UserTable'
import Add from '../../components/modal/user/Add'
import { getUsers, unlockUser, lockUser ,updateUser,addUser} from '../../services/userService.js'
const User = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [form] = Form.useForm()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  // ================= FETCH =================
  useEffect(() => {
    fetchUsers(page)
  }, [page])
  const fetchUsers = async (pageParam = page) => {
    setLoading(true)
    try {
      const res = await getUsers({
        page: pageParam,
        size: 5
      })
      const rawData = res.data?.data?.content || []
      const mappedData = rawData.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.role?.toLowerCase(),
        status: user.status,
        createdAt: user.createdDate?.split('T')[0] || ''
      }))

      setUsers(mappedData)
      setTotal(res.data?.data?.totalElements || 0)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách!' + error.message)
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

    form.setFieldsValue({
      ...record,
      status: record.status
    })
    setIsModalOpen(true)
  }
 const handleSubmit = async (values) => {
  setLoading(true)
  try {
    if (isEditMode) {
      // ================= UPDATE =================
      const payload = {
        username: values.username,
        email: values.email,
        fullName: values.fullName,
        role: values.role.toUpperCase(),
        active: values.status === 'ACTIVED'
      }
      await updateUser(selectedUser.id, payload)
      // update UI ngay
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...values,
                status: values.status
              }
            : user
        )
      )

      toast.success('Cập nhật thành công!')
    } else {
      // ================= ADD =================
      const payload = {
        username: values.username,
        email: values.email,
        fullName: values.fullName,
        role: values.role.toUpperCase()
      }

      await addUser(payload)

      // 🔥 FIX QUAN TRỌNG: setPage trước
      setPage(0)

      // 🔥 gọi lại API để lấy data mới nhất
      await fetchUsers(0)

      toast.success('Thêm thành công!')
    }

    setIsModalOpen(false)
    form.resetFields()
  } catch (error) {
    toast.error(
      error?.response?.data?.message || 'Lỗi xử lý!'
    )
    console.error(error)
  } finally {
    setLoading(false)
  }
}

  // ================= TOGGLE =================
  const handleToggleStatus = async (record) => {
    setLoading(true)

    const newStatus =
      record.status === 'ACTIVED' ? 'LOCKED' : 'ACTIVED'

    // update UI trước
    setUsers(users.map(u =>
      u.id === record.id ? { ...u, status: newStatus } : u
    ))

    try {
      if (newStatus === 'ACTIVED') {
        await unlockUser(record.id)
      } else {
        await lockUser(record.id)
      }

      toast.success(newStatus === 'ACTIVED' ? 'Đã kích hoạt' : 'Đã khóa')
    } catch {
      // rollback
      setUsers(users.map(u =>
        u.id === record.id ? { ...u, status: record.status } : u
      ))

      toast.error('Lỗi!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <UserHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản"
        buttonText="Thêm"
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
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default User