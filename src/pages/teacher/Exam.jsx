import React, { useState, useMemo } from 'react'
import { Button, Form } from 'antd'
import { toast } from 'react-toastify'
import '../../assets/styles/User.css'
import UserHeader from '../../components/user/UserHeader'
import UserFilter from '../../components/user/UserFilter'
import UserTable from '../../components/user/UserTable'
import Add from '../../components/modal/user/Add'
import ExamTable from '../../components/teacher/ExamTable'

// Mock data - Dữ liệu mẫu
const initialUsers = [
    {
        id: 0,
        code: 'EXAM001',
        title: 'Java cơ bản',
        duration: '00:30:00',
        questions: '10',
        createdAt: '2024-01-01'
    },
    {
        id: 1,
        code: 'EXAM002',
        title: 'Python cơ bản',
        duration: '00:45:00',
        questions: '15',
        createdAt: '2024-01-02'
    },
    {
        id: 2,
        code: 'EXAM003',
        title: 'JavaScript cơ bản',
        duration: '00:60:00',
        questions: '20',
        createdAt: '2024-01-03'
    },
    {
        id: 3,
        code: 'EXAM004',
        title: 'React cơ bản',
        duration: '00:90:00',
        questions: '25',
        createdAt: '2024-01-04'
    }
]

const Exam = () => {
    const [exams, setExams] = useState(initialUsers)
    const [form] = Form.useForm()


    const handleAdd = () => {
        setIsEditMode(false)
        setSelectedUser(null)
        form.resetFields()
        setIsModalOpen(true)
    }

    return (

        <div style={{ padding: 24 }}>

            {/* Header + Button cùng hàng */}
            <UserHeader
                title="Quản lý đề thi"
                description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
                buttonText="Thêm đề thi"
                handleAdd={handleAdd}
            />

            <ExamTable
                data={exams}
            />

        </div>
    )
}
export default Exam
