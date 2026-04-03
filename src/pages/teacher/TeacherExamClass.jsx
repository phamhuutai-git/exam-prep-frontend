import { useState, useMemo, useEffect } from "react";
import UserHeader from "../../components/user/UserHeader";
import ExamClassTable from "../../components/teacher/ExamClassTable";
import ViewClassDrawer from "../../components/modal/teacher/ViewClassDrawer";
import AppPagination from "../../components/common/AppPagination";
import EditClassExamModal from "../../components/modal/teacher/EditClassExamModal";
import "../../assets/styles/User.css";
import * as examsAPI from "../../services/teacher/examService.js";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import classExamService from "../../services/teacher/classExamService.js";
import { toast } from "react-toastify";

export default function TeacherExamsClass() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");

  const [viewClass, setViewClass] = useState(null);
  const [sortClass, setSortClass] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [allExams, setAllExams] = useState([]);
  const [reloadEdit, setReloadEdit] = useState(false);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await examsAPI.getClassesByTeacher(page, size);
        const result = response.data.data;

        setClasses(result.content);
        setTotal(result.totalElements);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được danh sách lớp học");
      }
    }
    fetchClasses();
  }, [page, size, reloadEdit]);

  const handleView = (record) => {
    setViewClass(record);
  };

  const handleEdit = async (record) => {
    setSelectedClass(record);

    try {
      const response = await examsAPI.getExamsByTeacher(0, 100);
      const result = response.data.data;
      setAllExams(result.content);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách đề thi");
    }

    setOpenModal(true);
  };

  const handleSave = async ({ classId, examIds }) => {
    try {
      // Call API to save changes
      await classExamService.updateExam(classId, examIds);
      toast.success("Lưu thay đổi thành công");

      setReloadEdit((prev) => !prev);
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving class exams: ", error);
      toast.error("Lỗi khi lưu thay đổi");
    }
  };

  // FILTER
  const filteredData = useMemo(() => {
    let data = classes;

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(q));
    }

    return data;
  }, [classes, search]);

  // PAGINATION
  const paginatedData = useMemo(() => {
    const start = page * size;
    return filteredData.slice(start, start + size);
  }, [filteredData, page, size]);

  useEffect(() => {
    setTotal(filteredData.length);
  }, [filteredData]);

  return (
    <div className="teacher-question-page">
      <UserHeader
        title="Quản lý lớp thi"
        description="Gán đề thi cho lớp học và quản lý lịch thi"
      />

      {/* Filters */}
      <div className="filter-bar">
        {/* SEARCH */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm kiếm tên lớp..."
            allowClear
            onClear={() => setSearch("")}
          />
        </div>

        <div className="filter-divider" />

        {/* SORT */}
        <Select
          value={sortClass || undefined}
          onChange={(value) => setSortClass(value || "")}
          placeholder="Lọc theo"
          allowClear
          style={{ width: 170 }}
        >
          <Select.Option value="class">Lớp</Select.Option>
          <Select.Option value="exam">Số đề thi</Select.Option>
        </Select>
      </div>
      {/* TABLE */}
      <div className="question-table-wrapper">
        <ExamClassTable
          data={paginatedData}
          onView={handleView}
          onEdit={handleEdit}
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

      <ViewClassDrawer data={viewClass} onClose={() => setViewClass(null)} />
      <EditClassExamModal
        open={openModal}
        data={selectedClass}
        exams={allExams}
        onCancel={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
