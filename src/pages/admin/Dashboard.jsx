import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserGraduate, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'

// Nhớ import đường dẫn API của bạn
import api from '../../services/apiClient'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0
  });

  // 1. CHUYỂN HÀM LÊN TRÊN: Khai báo hàm trước
  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      message.error("Không thể tải dữ liệu thống kê Admin");
    }
  };

  // 2. GỌI HÀM Ở DƯỚI
  useEffect(() => {
    // Thêm .catch() để triệt tiêu cảnh báo "Promise ignored" của ESLint
    fetchAdminStats().catch(console.error);
  }, []);

  return (
      <div style={{ padding: '24px' }}>
        <h1 style={{ marginBottom: '24px' }}>Dashboard Admin</h1>
        <p style={{ marginBottom: '32px', color: '#666' }}>
          Chào mừng đến với trang quản trị
        </p>

        <Row gutter={[16, 16]}>
          {/* Tổng lớp */}
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless">
              <Statistic
                  title="Tổng số lớp học"
                  value={stats.totalClasses}
                  prefix={<FontAwesomeIcon icon={faUsers} />}
                  styles={{ content: { color: '#52c41a' } }}
              />
            </Card>
          </Col>

          {/* Học sinh */}
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless">
              <Statistic
                  title="Tổng số học sinh"
                  value={stats.totalStudents}
                  prefix={<FontAwesomeIcon icon={faUserGraduate} />}
                  styles={{ content: { color: '#faad14' } }}
              />
            </Card>
          </Col>

          {/* Giáo viên */}
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless">
              <Statistic
                  title="Tổng số giáo viên"
                  value={stats.totalTeachers}
                  prefix={<FontAwesomeIcon icon={faChalkboardTeacher} />}
                  styles={{ content: { color: '#eb2f96' } }}
              />
            </Card>
          </Col>
        </Row>
      </div>
  )
}

export default Dashboard