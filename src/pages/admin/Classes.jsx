import React, { useState, useEffect } from 'react'
import { Form } from 'antd'
import { toast } from 'react-toastify'
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  addUsersToClass
} from '../../services/classes.js'

import {
  getStudentsByClass,
  getStudents
} from '../../services/userService.js'

import ClassesHeader from '../../components/classes/ClassesHeader'
import ClassesFilter from '../../components/classes/ClassesFilter'
import ClassesTable from '../../components/classes/ClassesTable'

import Add from '../../components/modal/classes/Add'
import AddUser from '../../components/modal/classes/AddUser.jsx'
import View from '../../components/modal/classes/View.jsx'

const Classes = () => {
  const [disabledUserIds, setDisabledUserIds] = useState([])
  const [currentClassUserIds, setCurrentClassUserIds] = useState([])

  // ================= VIEW =================
  const [showViewModal, setShowViewModal] = useState(false)
  const [students, setStudents] = useState([])
  const [viewLoading, setViewLoading] = useState(false)

  // ================= DATA =================
  const [classesData, setClassesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  // ================= ADD / EDIT =================
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [form] = Form.useForm()

  // ================= ADD USER =================
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [selectedClassForUsers, setSelectedClassForUsers] = useState(null)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [allStudents, setAllStudents] = useState([]) // ⭐ thêm

  // ⭐ Add refreshStudents function for AddUser
  const refreshStudents = async () => {
    if (!selectedClassForUsers) return

    try {
      const resAll = await getStudents()
      const all = resAll.data?.data || []

      const resClass = await getStudentsByClass(selectedClassForUsers.id)
      const currentStudents = resClass.data?.data || []

      const currentIds = currentStudents.map(s => s.id)
      const disabledIds = all
        .filter(s => s.classes && s.classes.id !== selectedClassForUsers.id)
        .map(s => s.id)

      setAllStudents(all)
      setCurrentClassUserIds(currentIds)
      setDisabledUserIds(disabledIds)
    } catch {
      toast.error('Lỗi refresh sinh viên!')
    }
  }

  // ================= SEARCH =================
  const [searchTerm, setSearchTerm] = useState('')

  // ================= FETCH CLASSES =================
  const fetchClasses = async (pageParam = 0) => {
    try {
      setLoading(true)
      const res = await getClasses({ page: pageParam })

      const data = res.data?.data
      setClassesData(data.content)
      setTotal(data.totalElements)
      setPage(data.number)

    } catch {
      toast.error('Lỗi tải dữ liệu!')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchClasses(page)
  }, [page])

  // ================= SEARCH =================
  const filteredData = classesData.filter(cls =>
    !searchTerm ||
    (cls.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ================= ADD =================
  const handleAdd = () => {
    setIsEditMode(false)
    setSelectedClass(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // ================= EDIT =================
  const handleEdit = (record) => {
    setIsEditMode(true)
    setSelectedClass(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  // ================= DELETE =================
const handleDelete = async (id) => {
  try {
    await deleteClass(id)
    toast.success('Xóa thành công!')

    if (classesData.length === 1 && page > 0) {
      setPage(page - 1) // quay về trang trước
    } else {
      fetchClasses(page) // reload bình thường
    }

  } catch {
    toast.error('Lỗi xóa!')
  }
}

  // ================= ADD USER =================
  const handleOpenAddUser = async (record) => {
    setSelectedClassForUsers(record)
  setShowAddUserModal(true)

  try {
    setAddUserLoading(true)

    const resAll = await getStudents()
    const all = resAll.data?.data || []

    const resClass = await getStudentsByClass(record.id)
    const currentStudents = resClass.data?.data || []

    const currentIds = currentStudents.map(s => s.id)

    // ✅ disable user thuộc class khác
    const disabledIds = all
      .filter(s => s.classes && s.classes.id !== record.id)
      .map(s => s.id)

    setAllStudents(all)
    setCurrentClassUserIds(currentIds)
    setDisabledUserIds(disabledIds)

  } catch {
    toast.error('Lỗi load sinh viên!')
  } finally {
    setAddUserLoading(false)
  }
}

 const handleAddUsersToClass = async (userIds) => {
  try {
    setAddUserLoading(true)

    const validIds = userIds.filter(
      id => !disabledUserIds.includes(id)
    )

    await addUsersToClass(selectedClassForUsers.id, validIds)

    toast.success('Cập nhật sinh viên thành công!')

    // ✅ reload lại students trong modal
    await refreshStudents()

    // ✅ QUAN TRỌNG: reload lại bảng classes
    await fetchClasses(page)

    setShowAddUserModal(false)

  } catch (err) {
    console.error(err)
    toast.error('Lỗi thêm sinh viên!')
  } finally {
    setAddUserLoading(false)
  }
}
  

  // ================= SUBMIT =================
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

  } catch (error) {
    const message =
      error?.response?.data?.message === 'Class name existed'
        ? 'Tên lớp đã tồn tại!'
        : error?.response?.data?.message || 'Lỗi hệ thống!'

    toast.error(message)
  }
}

  // ================= VIEW =================
  const handleView = async (record) => {
    setShowViewModal(true)
    setStudents([])

    try {
      setViewLoading(true)

      const res = await getStudentsByClass(record.id)
      const data = res.data?.data || []

      const formatted = data.map(item => ({
        id: item.id,
        username: item.username,
        fullName: `${item.firstName} ${item.lastName}`,
        email: item.email
      }))

      setStudents(formatted)

    } catch (error) {
      console.error(error)
      toast.error('Lỗi load sinh viên!')
    } finally {
      setViewLoading(false)
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
        onView={handleView}
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
      
      key={selectedClassForUsers?.id}        
      open={showAddUserModal}        
      users={allStudents}       
      currentClassUserIds={currentClassUserIds}
      
      disabledUserIds={disabledUserIds}        
      loading={addUserLoading}       
      onCancel={() => setShowAddUserModal(false)}       
      onSubmit={handleAddUsersToClass}       
      onRefreshStudents={refreshStudents}      />

      <View
        open={showViewModal}
        students={students}
        loading={viewLoading}
        onCancel={() => setShowViewModal(false)}
      />
    </div>
  )
}

export default Classes