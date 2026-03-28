import React from 'react';
import { Modal, Typography, Divider, List, Tag, Progress, Row, Col } from 'antd';

const { Title, Text } = Typography;

const View = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Modal
      title={`Chi tiết bài thi: ${data.title}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{ 
        maxHeight: '70vh', 
        overflowY: 'auto',
        padding: '0 4px'
      }}
    >
      {/* Thông tin chung */}
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Ngày thi: </Text>
          <Text>{data.date}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Thời gian: </Text>
          <Text>{data.duration}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Loại thi: </Text>
          <Tag color={data.type === 'Thi thật' ? 'green' : 'blue'}>
            {data.type}
          </Tag>
        </Col>
        <Col span={12}>
          <Text strong>Trạng thái: </Text>
          <Tag color={data.status === 'ĐẠT' ? 'green' : 'red'}>
            {data.status}
          </Tag>
        </Col>
      </Row>

      <Divider />

      {/* Kết quả */}
      <Title level={5}>Kết quả</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Text strong>Điểm số: </Text>
          <Text type="success">{data.score}/10</Text>
        </Col>
        <Col span={8}>
          <Text strong>Đúng: </Text>
          <Text>{data.correct}/{data.total}</Text>
        </Col>
        <Col span={8}>
          <Text strong>Sai: </Text>
          <Text type="danger">{data.wrong}</Text>
        </Col>
      </Row>

      <Progress
        percent={(data.correct / data.total) * 100}
        status={data.score >= 5 ? 'success' : 'exception'}
        style={{ margin: '16px 0' }}
      />

      <Divider />

      {/* Chi tiết câu hỏi */}

      
    </Modal>
  );
};

export default View;