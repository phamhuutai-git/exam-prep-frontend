import React, { useState, useMemo, useEffect } from "react";
import { Form } from "antd";
import { toast } from "react-toastify";
import "../../assets/styles/User.css";
import UserHeader from "../../components/user/UserHeader";
import UserFilter from "../../components/user/UserFilter";
import UserTable from "../../components/user/UserTable";
import Add from "../../components/modal/user/Add";
import { getUsers, unlockUser, lockUser, updateUser, addUser } from "../../services/userService.js";

const User = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // ================= FETCH ALL =================
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const firstRes = await getUsers({ page: 0, size: 1000 });
      const data = firstRes.data?.data;

      const rawData = data?.content || [];
      const totalElements = data?.totalElements || 0;

      let allRaw = rawData;

      if (rawData.length < totalElements) {
        const totalPages = Math.ceil(totalElements / pageSize);
        const requests = [];
        for (let i = 1; i < totalPages; i++) {
          requests.push(getUsers({ page: i, size: pageSize }));
        }
        const results = await Promise.all(requests);
        results.forEach((res) => {
          allRaw = [...allRaw, ...(res.data?.data?.content || [])];
        });
      }

      const mappedData = allRaw.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        role: user.role?.toLowerCase(),
        status: user.status,
        createdAt: user.createdDate?.split("T")[0] || "",
      }));

      setAllUsers(mappedData);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách! " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER (trên toàn bộ data) =================
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, roleFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, roleFilter]);

  // ================= Paginate filtered data =================
  const pagedUsers = useMemo(() => {
    const start = page * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  // ================= CRUD =================
  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedUser(record);
    form.setFieldsValue({ ...record });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditMode) {
        const payload = {
          username: values.username,
          email: values.email,
          fullName: values.fullName,
          role: values.role.toUpperCase(),
          active: values.status === "ACTIVED",
        };
        await updateUser(selectedUser.id, payload);
        setAllUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, ...values } : user,
          ),
        );
        toast.success("Cập nhật thành công!");
      } else {
        const payload = {
          username: values.username,
          email: values.email,
          fullName: values.fullName,
          role: values.role.toUpperCase(),
        };
        await addUser(payload);
        await fetchAllUsers(); // reload lại toàn bộ
        setPage(0);
        toast.success("Thêm thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi xử lý!");
    } finally {
      setLoading(false);
    }
  };

  // ================= TOGGLE =================
  const handleToggleStatus = async (record) => {
    setLoading(true);
    const newStatus = record.status === "ACTIVED" ? "LOCKED" : "ACTIVED";
    setAllUsers((prev) =>
      prev.map((u) => (u.id === record.id ? { ...u, status: newStatus } : u)),
    );
    try {
      if (newStatus === "ACTIVED") {
        await unlockUser(record.id);
      } else {
        await lockUser(record.id);
      }
      toast.success(newStatus === "ACTIVED" ? "Đã kích hoạt" : "Đã khóa");
    } catch {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === record.id ? { ...u, status: record.status } : u,
        ),
      );
      toast.error("Lỗi!");
    } finally {
      setLoading(false);
    }
  };

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
        data={pagedUsers}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        page={page}
        pageSize={pageSize}
        total={filteredUsers.length}
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
  );
};

export default User;