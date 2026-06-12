import React, { useState, useEffect } from 'react'; // ĐÃ XÓA useMemo
import { Form } from 'antd';
import { toast } from 'react-toastify';
import '../../assets/styles/User.css';
import UserHeader from '../../components/user/UserHeader';
import UserFilter from '../../components/user/UserFilter';
import UserTable from '../../components/user/UserTable';
import Add from '../../components/modal/user/Add';
import { getUsers, unlockUser, lockUser, updateUser, addUser } from '../../services/userService.js';

const User = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    setPage(0);
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      //Truyền trọn bộ tham số xuống Backend
      const res = await getUsers({
        page: page, // Hoặc page + 1 tùy thuộc backend của bạn bắt đầu từ 0 hay 1
        size: 5,
        keyword: searchTerm, // Hứng tham số keyword
        role: roleFilter ? roleFilter.toUpperCase() : '' // Convert sang TEACHER/STUDENT
      });

      const rawData = res.data?.data?.content || [];
      const mappedData = rawData.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: `${user.lastName || ''} ${user.firstName || ''}`.trim(),
        role: user.role?.toLowerCase(),
        status: user.status,
        createdAt: user.createdDate?.split('T')[0] || ''
      }));

      setUsers(mappedData);
      setTotal(res.data?.data?.totalElements || 0); // Lấy tổng số bản ghi thực tế từ DB
    } catch (error) {
      toast.error('Lỗi khi tải danh sách: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedUser(record);
    form.setFieldsValue({
      ...record,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const nameString = values.fullName ? values.fullName.trim() : "";
      const nameParts = nameString.split(" ");
      let firstName = "", lastName = "";

      if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = nameParts[0];
      } else if (nameParts.length > 1) {
        firstName = nameParts.pop();
        lastName = nameParts.join(" ");
      }

      const payload = {
        username: values.username,
        email: values.email,
        role: values.role?.toUpperCase(),
        firstName: firstName,
        lastName: lastName,
        first_name: firstName,
        last_name: lastName,
        fullName: nameString,
        ...(isEditMode ? { active: values.status === 'ACTIVED' } : { password: "12345678" })
      };

      if (isEditMode) {
        await updateUser(selectedUser.id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await addUser(payload);
        toast.success('Thêm thành công!');
      }

      setPage(0);
      await fetchUsers(); // Gọi lại để refresh data
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi xử lý!');
    } finally {
      setLoading(false);
    }
  };

  // ================= TOGGLE STATUS (Giữ nguyên) =================
  const handleToggleStatus = async (record) => {
    setLoading(true);
    const newStatus = record.status === 'ACTIVED' ? 'LOCKED' : 'ACTIVED';

    setUsers(users.map(u => u.id === record.id ? { ...u, status: newStatus } : u));
    try {
      if (newStatus === 'ACTIVED') {
        await unlockUser(record.id);
      } else {
        await lockUser(record.id);
      }
      toast.success(newStatus === 'ACTIVED' ? 'Đã kích hoạt tài khoản' : 'Đã khóa tài khoản');
    } catch {
      setUsers(users.map(u => u.id === record.id ? { ...u, status: record.status } : u));
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái!');
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

        {/* 4. Truyền thẳng `users` lấy từ API vào bảng, không dùng filteredUsers nữa */}
        <UserTable
            data={users}
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
  );
};

export default User;