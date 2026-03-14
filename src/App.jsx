import React from "react";
import Login from "./pages/login/Login";
import StudentLayout from "./layouts/student/StudentLayout";
import TeacherLayout from "./layouts/teacher/TeacherLayout";
import AdminLayouts from "./layouts/admin/AdminLayout";
import ResetPassword from "./pages/login/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
// import ComingSoon from './pages/admin/ComingSoon'
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import NotFound from "./pages/NotFound";
import User from "./pages/admin/User";
import Classes from "./pages/admin/Classes";
import Subjects from "./pages/admin/Subjects";
import AssignTeacher from "./pages/admin/AssignTeacher";
import TeacherExams from "./pages/teacher/TeacherExams";
import TeacherQuestions from "./pages/teacher/TeacherQuestions";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherDashboard from "./pages/teacher/TeacherDashbroard";
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
        />

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
          <Route path="students" element={<TeacherStudents />} />
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
          <Route path="subjects" element={<Subjects />} />
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
