import { useState, useMemo, useEffect } from "react";
import UserHeader from "../../components/user/UserHeader";
import ExamClassTable from "../../components/teacher/ExamClassTable";
import ViewClassDrawer from "../../components/modal/teacher/ViewClassDrawer";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import EditClassExamModal from "../../components/modal/teacher/EditClassExamModal";
import "../../assets/styles/User.css";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// MOCK DATA
const MOCK_CLASS_EXAMS = [
  {
    id: 1,
    name: "Railway01",
    students: 25,
    exams: [
      {
        id: 1, // class_exam.id
        examId: 1,
        title: "Java Basic Test",
        duration: 30,
        startTime: "2024-04-01 09:00:00",
        endTime: "2024-04-01 09:30:00",
        status: "HAS_EXAM",
      },
    ],
  },
  {
    id: 2,
    name: "Railway02",
    students: 30,
    exams: [
      {
        id: 2,
        examId: 2,
        title: "Spring Test",
        duration: 40,
        startTime: "2024-04-01 10:00:00",
        endTime: "2024-04-01 10:40:00",
        status: "HAS_EXAM",
      },
    ],
  },
  {
    id: 3,
    name: "Railway03",
    students: 20,
    exams: [
      {
        id: 3,
        examId: 3,
        title: "SQL Test",
        duration: 30,
        startTime: "2024-04-02 09:00:00",
        endTime: "2024-04-02 09:30:00",
        status: "HAS_EXAM",
      },
      {
        id: 4,
        examId: 4,
        title: "HTML Test",
        duration: 20,
        startTime: "2024-04-02 10:00:00",
        endTime: "2024-04-02 10:20:00",
        status: "HAS_EXAM",
      },
    ],
  },
  {
    id: 4,
    name: "Rocket01",
    students: 18,
    exams: [],
  },
  {
    id: 5,
    name: "Rocket02",
    students: 18,
    exams: [
      {
        id: 5,
        examId: 5,
        title: "JS Test",
        duration: 25,
        startTime: "2024-04-03 09:00:00",
        endTime: "2024-04-03 09:25:00",
        status: "HAS_EXAM",
      },
      {
        id: 6,
        examId: 6,
        title: "JS 1",
        duration: 25,
        startTime: "2024-04-03 10:00:00",
        endTime: "2024-04-03 10:25:00",
        status: "HAS_EXAM",
      },
    ],
  },
];
const MOCK_EXAMS = [
  { id: 1, title: "Java Basic Test" },
  { id: 2, title: "SQL Test" },
  { id: 3, title: "ReactJS" },
  { id: 4, title: "Spring Boot" },
];

export default function TeacherExamsClass() {
  const [classes, setClasses] = useState(MOCK_CLASS_EXAMS);
  const [search, setSearch] = useState("");

  const [viewClass, setViewClass] = useState(null);
  const [sortClass, setSortClass] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleView = (record) => {
    setViewClass(record);
  };

  const handleEdit = (record) => {
    setSelectedClass(record);
    setOpenModal(true);
  };
  const handleRemoveExam = (classId, examId) => {
    console.log("remove");
  };
  const handleSave = ({ examId, duration, startTime, endTime }) => {
    console.log("save");
    setOpenModal(false);
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

      <StatsCards
        items={[
          { title: "Total Class", value: 0 },
          { title: "Total Student", value: 0 },
          { title: "Total Has Exam", value: 0 },
          { title: "Total All Exam ", value: 0 },
        ]}
      />

      {/* Filters */}
      <div className="filter-bar">
        {/* SEARCH */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Search Class Name..."
            allowClear
            onClear={() => setSearch("")}
          />
        </div>

        <div className="filter-divider" />

        {/* SORT */}
        <Select
          value={sortClass || undefined}
          onChange={(value) => setSortClass(value || "")}
          placeholder="Sort by"
          allowClear
          style={{ width: 170 }}
        >
          <Select.Option value="class">Class</Select.Option>
          <Select.Option value="exam">Total Exam</Select.Option>
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
        exams={MOCK_EXAMS}
        onCancel={() => setOpenModal(false)}
        onSave={handleSave}
        onRemoveExam={handleRemoveExam}
      />
    </div>
  );
}
