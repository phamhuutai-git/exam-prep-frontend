// file
import { useState, useMemo, useEffect } from "react";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import ViewStudentDrawer from "../../components/modal/teacher/ViewStudentDrawer";
// css
import "../../assets/styles/User.css";
import "../../assets/styles/teacher/Question.css";
// thu vien
import { Button, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import StudentTable from "../../components/teacher/StudentTable";

const INITIAL_STUDENTS = [
  {
    id: 1,
    firstName: "Dung",
    lastName: "Pham",
    email: "student1@mail.com",
    username: "student1",
    classId: 1,
    status: "ACTIVED",
    createDate: "2024-01-04",
    attempts: [
      { exam: "Java Basic", score: 8.0, date: "2024-02-01" },
      { exam: "SQL", score: 6.0, date: "2024-02-01" },
    ],
  },
  {
    id: 2,
    firstName: "Huy",
    lastName: "Hoang",
    email: "student2@mail.com",
    username: "student2",
    classId: 2,
    status: "ACTIVED",
    createDate: "2024-01-05",
    attempts: [{ exam: "Java Basic", score: 8.0, date: "2024-02-01" }],
  },
  {
    id: 3,
    firstName: "Linh",
    lastName: "Nguyen",
    email: "student3@mail.com",
    username: "student3",
    classId: 1,
    status: "LOCKED",
    createDate: "2024-01-06",
    attempts: [{ exam: "Java Basic", score: 8.0, date: "2024-02-01" }],
  },
  {
    id: 4,
    firstName: "Minh",
    lastName: "Tran",
    email: "student4@mail.com",
    username: "student4",
    classId: 3,
    status: "ACTIVED",
    createDate: "2024-01-07",
    attempts: [{ exam: "Java Basic", score: 8.0, date: "2024-02-01" }],
  },
  {
    id: 5,
    firstName: "Minh",
    lastName: "Tran",
    email: "student4@mail.com",
    username: "student4",
    classId: 3,
    status: "ACTIVED",
    createDate: "2024-01-07",
    attempts: [{ exam: "Java Basic", score: 8.0, date: "2024-02-01" }],
  },
];
const CLASSES = [
  { id: 1, name: "Railway01" },
  { id: 2, name: "Railway02" },
  { id: 3, name: "Railway03" },
  { id: 4, name: "Rocket01" },
];
const getAvgScore = (attempts) => {
  if (!attempts.length) return null;
  return attempts.reduce((s, a) => s + a.score, 0) / attempts.length;
};

export default function TeacherStudent() {
  const [students] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);

  const filtered = useMemo(() => {
    let data = students;

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.username.toLowerCase().includes(q),
      );
    }

    if (classFilter)
      data = data.filter((s) => s.classId === Number(classFilter));

    if (statusFilter) data = data.filter((s) => s.status === statusFilter);

    return data;
  }, [students, search, classFilter, statusFilter]);

  useEffect(() => {
    setTotal(filtered.length);
  }, [filtered]);
  const paginatedData = useMemo(() => {
    const start = page * size;
    return filtered.slice(start, start + size);
  }, [filtered, page, size]);
  const tableData = useMemo(() => {
    return paginatedData.map((s) => {
      const avg = getAvgScore(s.attempts);

      return {
        ...s,
        key: s.id,
        student: `${s.firstName} ${s.lastName}`,
        class: CLASSES.find((c) => c.id === s.classId)?.name || "—",
        attempt: s.attempts.length,
        avg: avg !== null ? avg.toFixed(1) : "—",
      };
    });
  }, [paginatedData]);

  return (
    <div className="teacher-question-page">
      {/* Header */}
      <UserHeader
        title="Quản lý học sinh"
        description="Theo dõi học sinh và kết quả học tập"
      />

      {/* Stats */}
      <StatsCards
        items={[
          { title: "Tổng học sinh", value: 0 },
          { title: "Đang hoạt động", value: 0 },
          { title: "Bị khóa", value: 0 },
          { title: "Điểm TB", value: 0 },
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
            placeholder="Tìm theo tên học sinh , lớp , email..."
            allowClear
            onClear={() => setSearch("")}
          />
        </div>

        <div className="filter-divider" />

        {/* CLASS */}
        <Select
          value={classFilter || undefined}
          onChange={(value) => setClassFilter(value || "")}
          placeholder="Tất cả lớp"
          allowClear
          style={{ width: 150 }}
        >
          {CLASSES.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>

        {/* STATUS */}
        <Select
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value || "")}
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
        >
          <Select.Option value="ACTIVED">Hoạt động</Select.Option>
          <Select.Option value="LOCKED">Đã khóa</Select.Option>
        </Select>

        {/* SORT */}
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ width: 170 }}
        >
          <Select.Option value="name">Sắp xếp: Tên</Select.Option>
          <Select.Option value="score">Sắp xếp: Điểm TB</Select.Option>
          <Select.Option value="attempts">Sắp xếp: Lượt thi</Select.Option>
        </Select>
      </div>

      {/* Table */}
      <div className="question-table-wrapper">
        <StudentTable data={tableData} onView={(record) => setDetail(record)} />
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
      <ViewStudentDrawer student={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
