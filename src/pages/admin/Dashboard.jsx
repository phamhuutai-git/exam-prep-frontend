import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
const Dashboard = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Admin</h1>
      <p style={{ marginBottom: '32px', color: '#666' }}>Chào mừng đến với trang quản trị</p>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="borderless">
            <Statistic
              title="Tổng số người dùng"
              value={0}
              prefix={<FontAwesomeIcon icon={faUser} />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="borderless">
            <Statistic
              title="Tổng số lớp học"
              value={0}
              prefix={<FontAwesomeIcon icon={faUsers} />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Dashboard
