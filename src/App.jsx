import React from 'react'
import Login from './pages/login/Login'
import StudentLayout from './layouts/student/StudentLayout'
import TeacherLayout from './layouts/teacher/TeacherLayout'
import AdminLayouts from './layouts/admin/AdminLayout'
import ResetPassword from './pages/login/ResetPassword'
import Dashboard from './pages/admin/Dashboard'
import ComingSoon from './pages/admin/ComingSoon'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './route/ProtectedRoute'
import PublicRoute from './route/PublicRoute'
import NotFound from './pages/NotFound'
const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/reset-password' element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path='/student' element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }/>

        <Route path='/teacher' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }/>

        <Route path='/admin' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayouts />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ComingSoon />} />
          <Route path="classes" element={<ComingSoon />} />
          <Route path="subjects" element={<ComingSoon />} />
          <Route path="assign-teacher" element={<ComingSoon />} />
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
  )
}

export default App