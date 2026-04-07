import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserGraduate, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'
import { getClassCount, getStudentCount, getTeacherCount } from '../../services/userService'

const Dashboard = () => {

  const [totalClasses, setTotalClasses] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalTeachers, setTotalTeachers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classes, students, teachers] = await Promise.all([
          getClassCount(),
          getStudentCount(),
          getTeacherCount(),
        ])

        // ⚠️ backend bạn trả về là số → .data
        setTotalClasses(classes.data)
        setTotalStudents(students.data)
        setTotalTeachers(teachers.data)

      } catch (error) {
        console.error("Lỗi load dashboard:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Admin</h1>
      <p style={{ marginBottom: '32px', color: '#666' }}>
        Chào mừng đến với trang quản trị
      </p>

      <Row gutter={[16, 16]}>

        {/* Tổng lớp */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số lớp học"
              value={totalClasses}
              prefix={<FontAwesomeIcon icon={faUsers} />}
            />
          </Card>
        </Col>

        {/* Học sinh */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số học sinh"
              value={totalStudents}
              prefix={<FontAwesomeIcon icon={faUserGraduate} />}
            />
          </Card>
        </Col>

        {/* Giáo viên */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số giáo viên"
              value={totalTeachers}
              prefix={<FontAwesomeIcon icon={faChalkboardTeacher} />}
            />
          </Card>
        </Col>

      </Row>
    </div>
  )
}

export default Dashboard