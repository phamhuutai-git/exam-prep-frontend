import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUsers, faUserGraduate, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
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
              value={0}
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
              value={0}
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
              value={0}
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