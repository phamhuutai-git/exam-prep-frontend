import React, { useState, useEffect, useMemo } from "react";
import AssignTeacherHeader from "../../components/assignTeacher/AssignTeacherHeader";
import AssignTeacherFilter from "../../components/assignTeacher/AssignTeacherFilter";
import AssignTeacherTable from "../../components/assignTeacher/AssignTeacherTable";
import { toast } from "react-toastify";
import Add from "../../components/modal/assignTeacher/Add";
import ViewTeacher from "../../components/modal/assignTeacher/ViewTeacher";
import ViewStudent from "../../components/modal/assignTeacher/ViewStudent";

import {
  getTeachers,
  getStudentsByClass,
  getTeachersByClass,
} from "../../services/userService.js";

import { getClasses, addTeachersToClass } from "../../services/classes.js";

const AssignTeacher = () => {
  // ================= DATA =================
  const [allData, setAllData] = useState([]); //  toàn bộ classes
  const [teachers, setTeachers] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // ================= LOADING =================
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  const [teacherViewLoading, setTeacherViewLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);

  // ================= MODAL =================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // ================= FILTER / PAGE =================
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);

  // ================= DRAWER =================
  const [viewStudentDrawer, setViewStudentDrawer] = useState(false);
  const [viewTeacherDrawer, setViewTeacherDrawer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // ================= FETCH ALL CLASSES =================
  const fetchAllClasses = async () => {
    try {
      setClassLoading(true);

      const firstRes = await getClasses({ page: 0, size: 1000 });
      const data = firstRes.data?.data;
      let allRaw = data?.content || [];
      const totalElements = data?.totalElements || 0;

      // Nếu backend giới hạn size, fetch thêm các page còn lại
      if (allRaw.length < totalElements) {
        const totalPages = Math.ceil(totalElements / pageSize);
        const requests = [];
        for (let i = 1; i < totalPages; i++) {
          requests.push(getClasses({ page: i, size: pageSize }));
        }
        const results = await Promise.all(requests);
        results.forEach((res) => {
          allRaw = [...allRaw, ...(res.data?.data?.content || [])];
        });
      }

      const classList = allRaw.map((item) => ({
        id: item.id,
        name: item.name,
        studentCount: item.studentCount || 0,
        teacherCount: item.teacherCount || 0,
      }));

      setAllData(classList);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi load danh sách lớp!");
    } finally {
      setClassLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return allData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allData, searchTerm]);

  // 🔥 Reset page khi search thay đổi
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // ================= PAGINATE =================
  const pagedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // ================= OPEN MODAL =================
  const handleOpenAddTeacher = async (record) => {
    setIsModalOpen(true);
    try {
      setTeacherLoading(true);
      const [teacherRes, classTeacherRes] = await Promise.all([
        getTeachers(),
        getTeachersByClass(record.id),
      ]);

      const teacherList =
        teacherRes.data?.data?.content || teacherRes.data?.data || [];

      const classTeacherList =
        classTeacherRes.data?.data?.content || classTeacherRes.data?.data || [];

      setTeachers(teacherList);
      setSelectedClass({ ...record, teachers: classTeacherList });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi load giáo viên!");
    } finally {
      setTeacherLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (teacherIds) => {
    if (!selectedClass) return;
    try {
      setTeacherLoading(true);
      await addTeachersToClass(selectedClass.id, teacherIds);

      const res = await getTeachersByClass(selectedClass.id);
      const updatedTeachers = res.data?.data?.content || res.data?.data || [];

      // Cập nhật local state luôn, không fetch lại
      setAllData((prev) =>
        prev.map((cls) =>
          cls.id === selectedClass.id
            ? { ...cls, teacherCount: updatedTeachers.length }
            : cls,
        ),
      );

      toast.success("Phân công giáo viên thành công");
      setIsModalOpen(false);
      setSelectedClass(null);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi phân công giáo viên!");
    } finally {
      setTeacherLoading(false);
    }
  };

  // ================= VIEW TEACHERS =================
  const handleViewTeachers = async (record) => {
    setCurrentRecord(record);
    setViewTeacherDrawer(true);
    try {
      setTeacherViewLoading(true);
      const res = await getTeachersByClass(record.id);
      const teacherList = res.data?.data?.content || res.data?.data || [];
      setClassTeachers(teacherList);
    } catch (err) {
      toast.error("Lỗi load giáo viên!" + err);
    } finally {
      setTeacherViewLoading(false);
    }
  };

  // ================= VIEW STUDENTS =================
  const handleViewStudents = async (record) => {
    setCurrentRecord(record);
    setViewStudentDrawer(true);
    try {
      setStudentLoading(true);
      const res = await getStudentsByClass(record.id);
      const studentList = res.data?.data?.content || res.data?.data || [];
      setStudents(studentList);
    } catch (err) {
      toast.error("Lỗi load sinh viên!" + err);
    } finally {
      setStudentLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <AssignTeacherHeader
        title="Phân công giáo viên"
        description="Quản lý việc phân công giáo viên"
      />
      <AssignTeacherFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClear={() => setSearchTerm("")}
      />
      <AssignTeacherTable
        data={pagedData} //  đã filter + phân trang
        page={page}
        pageSize={pageSize}
        total={filteredData.length} //  total theo filter
        onPageChange={setPage}
        onAddTeacher={handleOpenAddTeacher}
        onViewTeachers={handleViewTeachers}
        onViewStudents={handleViewStudents}
        loading={classLoading}
      />
      <ViewTeacher
        open={viewTeacherDrawer}
        classInfo={currentRecord}
        teachers={classTeachers}
        loading={teacherViewLoading}
        onClose={() => setViewTeacherDrawer(false)}
      />
      <ViewStudent
        open={viewStudentDrawer}
        classInfo={currentRecord}
        students={students}
        loading={studentLoading}
        onClose={() => setViewStudentDrawer(false)}
      />
      <Add
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={teacherLoading}
        users={teachers}
        currentClassTeacherIds={selectedClass?.teachers?.map((t) => t.id) || []}
      />
    </div>
  );
};

export default AssignTeacher;
