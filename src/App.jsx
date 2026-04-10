import React from "react";
import Login from "./pages/login/Login";
import StudentLayout from "./layouts/student/StudentLayout";
import TeacherLayout from "./layouts/teacher/TeacherLayout";
import AdminLayouts from "./layouts/admin/AdminLayout";
import ResetPassword from "./pages/login/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import NotFound from "./pages/NotFound";
import User from "./pages/admin/User";
import Classes from "./pages/admin/Classes";
import Thithat from "./pages/student/Thithat";
import Thithu from "./pages/student/Thithu";
import ErrorBoundary from "./components/ErrorBoundary";
import AssignTeacher from "./pages/admin/AssignTeacher";
import StudentDashboard from "./pages/student/Dashboard";
import LichSuThi from "./pages/student/LichSuThi";
import DeThiYeuThich from "./pages/student/DeThiYeuThich";
import BaiThi from "./pages/student/BaiThi";
import TeacherExams from "./pages/teacher/TeacherExams";
import TeacherQuestions from "./pages/teacher/TeacherQuestions";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherExamsClass from "./pages/teacher/TeacherExamClass";
import Bailuyentap from "./pages/student/Bailuyentap";
import LichSuluyentap from "./pages/student/LichSuluyentap";
import TeacherCategory from "./pages/teacher/TeacherCategory";
const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="lich-su-thi" element={<LichSuThi />} />
          <Route path="de-thi-yeu-thich" element={<DeThiYeuThich />} />
          <Route path="bai-thi" element={<BaiThi />} />
          <Route path="bai-thi-luyen-tap" element={<Bailuyentap />} />
          <Route path="lich-su-luyen-tap" element={<LichSuluyentap />} />
          <Route path="thi/:id" element={<Thithat />} />

          <Route path="thithu/:id" element={<Thithu />} />
          <Route
            path="bai-thi"
            element={
              <ErrorBoundary>
                <BaiThi />
              </ErrorBoundary>
            }
          />
        </Route>

        {/* TEACHER */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="exams" element={<TeacherExams />} />
          <Route path="questions" element={<TeacherQuestions />} />
          <Route path="category" element={<TeacherCategory />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="exam-classes" element={<TeacherExamsClass />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayouts />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="classes" element={<Classes />} />
          <Route path="assign-teacher" element={<AssignTeacher />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
};

export default App;
