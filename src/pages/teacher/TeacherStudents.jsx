import { useState, useMemo, useEffect } from "react";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import ViewStudentDrawer from "../../components/modal/teacher/ViewStudentDrawer";
import "../../assets/styles/User.css";
import "../../assets/styles/teacher/Question.css";

import { Input, Select } from "antd";
import StudentTable from "../../components/teacher/StudentTable";
import * as examService from "../../services/teacher/examService.js";

export default function TeacherStudent() {
  // ================= STATE =================
  const [searchExam, setSearchExam] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [classFilter, setClassFilter] = useState("");

  const [detail, setDetail] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH API =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await examService.getExamAttemptsByTeacher(
          page,
          size
        );

        setData(response.data.data.content || []);
        setTotal(response.data.data.totalElements || 0);
      } catch (error) {
        console.error("Failed to fetch exam attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  // ================= MAP DATA =================
  const tableData = useMemo(() => {
    return data.map((item, index) => ({
      key: item.id ?? index,
      code: item.exam?.code || "_",
      exam: item.exam?.title || "_",
      student: `${item.student?.firstName || ""} ${item.student?.lastName || ""
        }`,
      class: item.student?.classes?.name || "_",
      score:
        item.score !== null && item.score !== undefined
          ? item.score.toFixed(1)
          : "_",
      raw: item,
    }));
  }, [data]);

  // ================= CLASS OPTIONS =================
  const classOptions = useMemo(() => {
    const classes = data.map((item) => item.student?.classes?.name);
    return [...new Set(classes.filter(Boolean))];
  }, [data]);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchExam = searchExam
        ? item.exam.toLowerCase().includes(searchExam.toLowerCase())
        : true;

      const matchStudent = searchStudent
        ? item.student.toLowerCase().includes(searchStudent.toLowerCase())
        : true;

      const matchClass = classFilter ? item.class === classFilter : true;

      return matchExam && matchStudent && matchClass;
    });
  }, [tableData, searchExam, searchStudent, classFilter]);

  // reset page khi filter/search
  useEffect(() => {
    setPage(0);
  }, [searchExam, searchStudent, classFilter]);

  // ================= UI =================
  return (
    <div className="teacher-question-page">
      {/* Header */}
      <UserHeader
        title="Quản lý học viên"
        description="Theo dõi học sinh và kết quả học tập"
      />

      {/* Filters */}
      <div className="filter-bar" style={{ gap: 12 }}>
        {/* Search Exam */}
        <Input
          value={searchExam}
          onChange={(e) => setSearchExam(e.target.value)}
          placeholder="Tìm theo tên đề thi"
          variant="borderless"
          style={{
            width: 500,
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #d9d9d9",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
          allowClear
        />

        {/* Search Student */}
        <Input
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
          placeholder="Tìm theo tên học sinh"
          variant="borderless"
          style={{
            width: 500,
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #d9d9d9",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
          allowClear
        />

        {/* Class Filter */}
        <Select
          value={classFilter || undefined}
          onChange={(value) => setClassFilter(value || "")}
          placeholder="Lớp"
          allowClear
          variant="borderless"
          style={{
            width: 160,
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #d9d9d9",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {classOptions.map((cls) => (
            <Select.Option key={cls} value={cls}>
              {cls}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className="question-table-wrapper">
        <StudentTable
          data={filteredData}
          loading={loading}
          onView={(record) => setDetail(record.raw)}
        />
      </div>

      {/* Pagination */}
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      {/* Drawer */}
      <ViewStudentDrawer
        student={detail}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}