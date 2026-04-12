import React, { useState, useMemo, useEffect } from "react";
import { Form } from "antd";
import { toast } from "react-toastify";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  addUsersToClass,
} from "../../services/classes.js";
import { getStudentsByClass, getStudents } from "../../services/userService.js";

import ClassesHeader from "../../components/classes/ClassesHeader";
import ClassesFilter from "../../components/classes/ClassesFilter";
import ClassesTable from "../../components/classes/ClassesTable";
import Add from "../../components/modal/classes/Add";
import AddUser from "../../components/modal/classes/AddUser.jsx";
import View from "../../components/modal/classes/View.jsx";

const PAGE_SIZE = 5;

const Classes = () => {
  const [disabledUserIds, setDisabledUserIds] = useState([]);
  const [currentClassUserIds, setCurrentClassUserIds] = useState([]);

  // ================= VIEW =================
  const [showViewModal, setShowViewModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  // ================= DATA =================
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  // ================= ADD / EDIT =================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();

  // ================= ADD USER =================
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedClassForUsers, setSelectedClassForUsers] = useState(null);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);

  // ================= SEARCH =================
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH ALL CLASSES =================
  const fetchAllClasses = async () => {
    try {
      setLoading(true);

      // Fetch page đầu để biết tổng số
      const firstRes = await getClasses({ page: 0, size: 1000 });
      const data = firstRes.data?.data;
      let allRaw = data?.content || [];
      const totalElements = data?.totalElements || 0;

      // Nếu backend giới hạn size, fetch thêm các page còn lại
      if (allRaw.length < totalElements) {
        const totalPages = Math.ceil(totalElements / PAGE_SIZE);
        const requests = [];
        for (let i = 1; i < totalPages; i++) {
          requests.push(getClasses({ page: i, size: PAGE_SIZE }));
        }
        const results = await Promise.all(requests);
        results.forEach((res) => {
          allRaw = [...allRaw, ...(res.data?.data?.content || [])];
        });
      }

      setAllClasses(allRaw);
    } catch {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  // ================= FILTER (trên toàn bộ data) =================
  const filteredData = useMemo(() => {
    return allClasses.filter(
      (cls) =>
        !searchTerm ||
        (cls.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allClasses, searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // ================= Paginate filtered data =================
  const pagedData = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  // ================= REFRESH STUDENTS =================
  const refreshStudents = async () => {
    if (!selectedClassForUsers) return;
    try {
      const resAll = await getStudents();
      const all = resAll.data?.data || [];

      const resClass = await getStudentsByClass(selectedClassForUsers.id);
      const currentStudents = resClass.data?.data || [];

      const currentIds = currentStudents.map((s) => s.id);
      const disabledIds = all
        .filter((s) => s.classes && s.classes.id !== selectedClassForUsers.id)
        .map((s) => s.id);

      setAllStudents(all);
      setCurrentClassUserIds(currentIds);
      setDisabledUserIds(disabledIds);
    } catch {
      toast.error("Lỗi refresh sinh viên!");
    }
  };

  // ================= ADD =================
  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedClass(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ================= EDIT =================
  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedClass(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deleteClass(id);
      toast.success("Xóa thành công!");

      const updated = allClasses.filter((cls) => cls.id !== id);
      setAllClasses(updated);

      // Nếu page hiện tại không còn data thì lùi lại
      const newFiltered = updated.filter(
        (cls) =>
          !searchTerm ||
          (cls.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const maxPage = Math.max(
        0,
        Math.ceil(newFiltered.length / PAGE_SIZE) - 1,
      );
      if (page > maxPage) setPage(maxPage);
    } catch {
      toast.error("Lỗi xóa!");
    }
  };

  // ================= ADD USER =================
  const handleOpenAddUser = async (record) => {
    setSelectedClassForUsers(record);
    setShowAddUserModal(true);

    try {
      setAddUserLoading(true);

      const resAll = await getStudents();
      const all = resAll.data?.data || [];

      const resClass = await getStudentsByClass(record.id);
      const currentStudents = resClass.data?.data || [];

      const currentIds = currentStudents.map((s) => s.id);
      const disabledIds = all
        .filter((s) => s.classes && s.classes.id !== record.id)
        .map((s) => s.id);

      setAllStudents(all);
      setCurrentClassUserIds(currentIds);
      setDisabledUserIds(disabledIds);
    } catch {
      toast.error("Lỗi load sinh viên!");
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleAddUsersToClass = async (userIds) => {
    try {
      setAddUserLoading(true);

      const validIds = userIds.filter((id) => !disabledUserIds.includes(id));
      await addUsersToClass(selectedClassForUsers.id, validIds);

      toast.success("Cập nhật sinh viên thành công!");
      await refreshStudents();
      await fetchAllClasses();
      setShowAddUserModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi thêm sinh viên!");
    } finally {
      setAddUserLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      if (isEditMode) {
        await updateClass(selectedClass.id, values);
        // Update local state ngay, không cần reload
        setAllClasses((prev) =>
          prev.map((cls) =>
            cls.id === selectedClass.id ? { ...cls, ...values } : cls,
          ),
        );
        toast.success("Cập nhật thành công!");
      } else {
        await createClass(values);
        toast.success("Tạo thành công!");
        await fetchAllClasses();
        setPage(0);
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      const message =
        error?.response?.data?.message === "Class name existed"
          ? "Tên lớp đã tồn tại!"
          : error?.response?.data?.message || "Lỗi hệ thống!";
      toast.error(message);
    }
  };

  // ================= VIEW =================
  const handleView = async (record) => {
    setShowViewModal(true);
    setStudents([]);

    try {
      setViewLoading(true);
      const res = await getStudentsByClass(record.id);
      const data = res.data?.data || [];

      const formatted = data.map((item) => ({
        id: item.id,
        username: item.username,
        fullName: `${item.firstName} ${item.lastName}`,
        email: item.email,
      }));

      setStudents(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi load sinh viên!");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <ClassesHeader
        title="Quản lý lớp"
        description="Tạo, chỉnh sửa, xóa lớp học"
        buttonText="Tạo lớp"
        handleAdd={handleAdd}
      />

      <ClassesFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ClassesTable
        data={pagedData}
        loading={loading}
        onadd={handleOpenAddUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        total={filteredData.length}
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
        onRefreshStudents={refreshStudents}
      />

      <View
        open={showViewModal}
        students={students}
        loading={viewLoading}
        onCancel={() => setShowViewModal(false)}
      />
    </div>
  );
};

export default Classes;
