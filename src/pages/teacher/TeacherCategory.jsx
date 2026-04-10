import { Button, Input, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import { useEffect, useState } from "react";
import CategoryTable from "../../components/teacher/CrategoriesTable";
import categoriesService from "../../services/teacher/categories";
import AppPagination from "../../components/common/AppPagination";
import CreateAndEditCategories from "../../components/modal/teacher/CreateAndEditCategories";
export default function TeacherCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // filter
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState();

  // modal + CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesService.getAllCategories({
        page,
        size,
        name: search,
        categoryId: catFilter,
      });
      setCategories(res.data.data.content || []);
      setTotal(res.data.data.totalElements || 0);
    } catch (err) {
      message.error("Load categories failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [page, size, search, catFilter]);

  // ================= CRUD =================
  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    try {
      if (editingCategory) {
        await categoriesService.updateCategories(editingCategory.id, values);
        message.success("Cập nhật thành công");
      } else {
        await categoriesService.createCategories(values);
        message.success("Tạo thành công");
      }

      setModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      err?.response?.data?.message && message.error(err.response.data.message);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);
  // ================= RENDER =================
  return (
    <div className="teacher-question-page">
      {/* HEADER */}
      <UserHeader
        title="Quản lý danh mục"
        description="Tạo, chỉnh sửa, xóa và quản lý danh mục"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
            }}
          >
            Thêm danh mục
          </Button>
        }
      />

      {/* STATS */}
      <StatsCards
        items={[
          {
            title: "Tổng số danh mục",
            value: total,
          },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm danh mục..."
            allowClear
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="question-table-wrapper">
        <CategoryTable
          data={categories}
          loading={loading}
          onEdit={(c) => {
            setEditingCategory(c);
            setModalOpen(true);
          }}
        />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      {/* MODAL */}
      <CreateAndEditCategories
        open={modalOpen}
        handleCancel={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        handleSubmit={handleSubmit}
        loading={loadingSubmit}
        initialValues={editingCategory}
      />
    </div>
  );
}
