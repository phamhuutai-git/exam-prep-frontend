import { useState, useMemo, useEffect } from "react";
import UserHeader from "../../components/user/UserHeader";
import ExamClassTable from "../../components/teacher/ExamClassTable";
import AssignExamModal from "../../components/modal/teacher/AssignExamModal";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";

import "../../assets/styles/User.css";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// MOCK DATA
const MOCK_CLASSES = [
  {
    id: 1,
    name: "Railway01",
    students: 25,
    exam: "Java Basic",
    duration: 60,
    status: "HAS_EXAM",
  },
  {
    id: 2,
    name: "Railway02",
    students: 30,
    exam: "Java Basic",
    duration: 20,
    status: "HAS_EXAM",
  },
  {
    id: 3,
    name: "Railway03",
    students: 20,
    exam: "SQL Test",
    duration: 45,
    status: "HAS_EXAM",
  },
  {
    id: 4,
    name: "Rocket01",
    students: 18,
    exam: null,
    duration: null,
    status: "NO_EXAM",
  },
  {
    id: 5,
    name: "Rocket02",
    students: 18,
    exam: "SQL Test",
    duration: 45,
    status: "HAS_EXAM",
  },
];

const MOCK_EXAMS = [
  { id: 1, title: "Java Basic" },
  { id: 2, title: "SQL Test" },
  { id: 3, title: "ReactJS" },
  { id: 4, title: "Spring Boot" },
];

export default function TeacherExamsClass() {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedClass, setSelectedClass] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);

  // FILTER
  const filteredData = useMemo(() => {
    let data = classes;

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (statusFilter) {
      data = data.filter((c) => c.status === statusFilter);
    }

    return data;
  }, [classes, search, statusFilter]);

  // PAGINATION
  const paginatedData = useMemo(() => {
    const start = page * size;
    return filteredData.slice(start, start + size);
  }, [filteredData, page, size]);

  useEffect(() => {
    setTotal(filteredData.length);
  }, [filteredData]);
  useEffect(() => {}, [classes]);

  const handleAssignClick = (record) => {
    setSelectedClass(record);
    setOpenModal(true);
  };

  const handleAssignSubmit = ({ examId, duration }) => {
    const exam = MOCK_EXAMS.find((e) => e.id === examId);

    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClass.id
          ? {
              ...c,
              exam: exam?.title,
              duration,
              status: "HAS_EXAM",
            }
          : c,
      ),
    );

    setOpenModal(false);
  };

  return (
    <div className="teacher-question-page">
      <UserHeader
        title="Quản lý lớp thi"
        description="Gán đề thi cho lớp học và quản lý lịch thi"
      />{" "}
      <StatsCards
        items={[
          { title: "Total Class", value: 0 },
          { title: "Total Student", value: 0 },
          { title: "Has Exam", value: 0 },
          { title: "No Exam", value: 0 },
        ]}
      />
      {/* loc */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm kiếm tên lớp..."
            allowClear
          />
        </div>

        {/* Divider dọc */}
        <div className="filter-divider" />

        <Select
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value || "")}
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
        >
          <Select.Option value="HAS_EXAM">HAS_EXAM</Select.Option>
          <Select.Option value="NO_EXAM">NO_EXAM</Select.Option>
        </Select>
      </div>
      <div className="question-table-wrapper">
        <ExamClassTable data={paginatedData} onAssign={handleAssignClick} />
      </div>
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />
      <AssignExamModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAssignSubmit}
        exams={MOCK_EXAMS}
      />
    </div>
  );
}
