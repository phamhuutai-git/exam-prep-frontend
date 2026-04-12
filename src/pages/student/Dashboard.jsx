import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList, faHeart } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Học sinh</h1>
      <p style={{ marginBottom: '32px', color: '#666' }}>Chào mừng đến với bảng điều khiển học tập</p>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="borderless">
            <Statistic
              title="Số bài thi đã làm"
              value={0}
              prefix={<FontAwesomeIcon icon={faClipboardList} />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="borderless">
            <Statistic
              title="Đề thi yêu thích"
              value={0}
              prefix={<FontAwesomeIcon icon={faHeart} />}
              styles={{ content: { color: '#ff4d4f' } }}
            />
          </Card>
        </Col>
        
      </Row>
    </div>
  )
}

export default Dashboard

