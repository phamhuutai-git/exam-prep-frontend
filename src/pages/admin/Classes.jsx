import React, { useState, useEffect } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import { getClasses, createClass, updateClass, deleteClass } from '../../services/classes.js'
import ClassesHeader from '../../components/classes/ClassesHeader'
import ClassesFilter from '../../components/classes/ClassesFilter'
import ClassesTable from '../../components/classes/ClassesTable'
import Add from '../../components/modal/classes/Add'
import AddUser from '../../components/modal/classes/AddUser.jsx'
import { getUsers } from '../../services/userService.js'
import { addUsersToClass } from '../../services/classes.js'
const Classes = () => {
  const [classesData, setClassesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [form] = Form.useForm()

  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [selectedClassForUsers, setSelectedClassForUsers] = useState(null)
  const [userLoading, setUserLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')

  // 🔥 FETCH API CHUẨN
  const fetchClasses = async (pageParam = 0) => {
    try {
      setLoading(true)

      const res = await getClasses({ page: pageParam })

      const data = res.data?.data

      setClassesData(data.content)
      setTotal(data.totalElements)
      setPage(data.number)

    } catch (error) {
      console.error(error)
      toast.error('Lỗi tải dữ liệu!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses(page)
  }, [page])

  // 🔥 SEARCH (theo name)
  const filteredData = classesData.filter(cls =>
    !searchTerm ||
    (cls.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ➕ ADD
  const handleAdd = () => {
    setIsEditMode(false)
    setSelectedClass(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // ✏️ EDIT
  const handleEdit = (record) => {
    setIsEditMode(true)
    setSelectedClass(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  // ❌ DELETE
  const handleDelete = async (id) => {
    try {
      await deleteClass(id)
      toast.success('Xóa thành công!')
      fetchClasses(page)
    } catch {
      toast.error('Lỗi xóa!')
    }
  }

  // Fetch available users for AddUser modal
  const fetchUsers = async () => {
    try {
      setUserLoading(true)
      const res = await getUsers()
      setAvailableUsers(res.data?.data?.content || [])
    } catch (error) {
      console.error(error)
      toast.error('Lỗi tải danh sách sinh viên!')
    } finally {
      setUserLoading(false)
    }
  }

  // Open AddUser modal for specific class
  const handleOpenAddUser = async (record) => {
    setSelectedClassForUsers(record)
    await fetchUsers()
    setShowAddUserModal(true)
  }

  // Submit adding users to class
  const handleAddUsersToClass = async (userIds) => {
    if (!userIds.length || !selectedClassForUsers) {
      toast.warning('Chọn ít nhất 1 sinh viên!')
      return
    }
    try {
      await addUsersToClass(selectedClassForUsers.id, userIds)
      toast.success('Thêm sinh viên thành công!')
      setShowAddUserModal(false)
      setAvailableUsers([])
      setSelectedClassForUsers(null)
      fetchClasses(page)
    } catch (error) {
      console.error(error)
      toast.error('Lỗi thêm sinh viên!')
    }
  }

  // 💾 SUBMIT
  const handleSubmit = async (values) => {
    try {
      if (isEditMode) {
        await updateClass(selectedClass.id, values)
        toast.success('Cập nhật thành công!')
      } else {
        await createClass(values)
        toast.success('Tạo thành công!')
      }

      setIsModalOpen(false)
      form.resetFields()
      fetchClasses(page)

    } catch {
      toast.error('Lỗi lưu!')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <ClassesHeader
        title="Quản lý lớp"
        description="Tạo, chỉnh sửa, xóa lớp học"
        buttonText="Tạo lớp"
        handleAdd={handleAdd}
      />

      <ClassesFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ClassesTable
        data={filteredData}
        loading={loading}
        onadd={handleOpenAddUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
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

      <AddUser
        open={showAddUserModal}
        users={availableUsers}
        loading={userLoading}
        onCancel={() => setShowAddUserModal(false)}
        onSubmit={handleAddUsersToClass}
      />
    </div>
  )
}

export default Classes
