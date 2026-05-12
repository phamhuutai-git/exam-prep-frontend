import React from 'react';
import { Row, Col, Card, Typography, Space, Button } from 'antd';
import {
    EditOutlined, FileWordOutlined, FileExcelOutlined,
    RobotOutlined, ArrowLeftOutlined, UploadOutlined,
    DatabaseOutlined // Bổ sung icon cho Ngân hàng câu hỏi
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ExamCreationPortal = () => {
    const navigate = useNavigate();

    // Bổ sung thêm phương thức "Từ ngân hàng" vào mảng này
    const methods = [
        {
            id: 'manual',
            title: 'Tự soạn đề thi / Bài tập',
            desc: 'Sử dụng trình soạn thảo bóc tách của hệ thống. Chỉnh sửa và gõ nội dung nhanh chóng.',
            icon: <EditOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
            path: '/teacher/exams/fast-create',
            tag: 'Phổ biến'
        },
        {
            id: 'bank',
            title: 'Tạo từ ngân hàng câu hỏi',
            desc: 'Lựa chọn, xáo trộn các câu hỏi đã có sẵn trong hệ thống để tạo thành một đề thi mới.',
            icon: <DatabaseOutlined style={{ fontSize: 32, color: '#fa8c16' }} />, // Màu cam nổi bật
            path: '/teacher/exams/from-bank', // Đường dẫn tạm, bạn có thể đổi sau
            tag: 'Khuyên dùng'
        },
        {
            id: 'word',
            title: 'Tạo đề từ file Microsoft Word',
            desc: 'Hỗ trợ bóc tách từ file .doc, .docx. Tự động nhận diện câu hỏi và đáp án.',
            icon: <FileWordOutlined style={{ fontSize: 32, color: '#2b579a' }} />,
            path: '/teacher/exams/import-word',
            tag: 'Mới'
        },
        {
            id: 'ai',
            title: 'Tạo đề thi bằng Trí tuệ nhân tạo (AI)',
            desc: 'Chỉ cần nhập chủ đề, AI sẽ tự động tạo bộ câu hỏi chất lượng cho bạn.',
            icon: <RobotOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
            path: '/teacher/exams/ai-create',
        },
        {
            id: 'excel',
            title: 'Tạo đề từ file Excel',
            desc: 'Phù hợp cho các bộ đề có số lượng câu hỏi cực lớn.',
            icon: <FileExcelOutlined style={{ fontSize: 32, color: '#217346' }} />,
            path: '/teacher/exams/import-excel',
        }
    ];

    return (
        <div style={{ padding: '40px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/teacher/exams')} style={{ marginBottom: 20 }}>
                Quay lại
            </Button>

            <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <Title level={2}>Tạo đề mới</Title>
                <Text type="secondary" style={{ fontSize: 16 }}>Chọn một phương thức để bắt đầu tạo nội dung kiểm tra</Text>
            </div>

            <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Khu vực Upload Kéo thả */}
                <Col span={14}>
                    <Card style={{ borderRadius: 12, textAlign: 'center', padding: '60px 20px', border: '2px dashed #d9d9d9', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div>
                            <UploadOutlined style={{ fontSize: 64, color: '#bfbfbf', marginBottom: 20 }} />
                            <Title level={4}>Chọn hoặc kéo thả file vào đây</Title>
                            <Text type="secondary">Hỗ trợ định dạng .doc, .docx, .pdf, .xls, .xlsx</Text>
                            <div style={{ marginTop: 30 }}>
                                <Button type="primary" size="large" shape="round">Chọn file từ máy tính</Button>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Khu vực Các phương thức tạo đề (Cuộn dọc) */}
                <Col span={10}>
                    <div style={{ height: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            {methods.map(method => (
                                <Card
                                    hoverable
                                    key={method.id}
                                    style={{ borderRadius: 10, cursor: 'pointer', border: '1px solid #f0f0f0' }}
                                    onClick={() => navigate(method.path)}
                                >
                                    <Card.Meta
                                        avatar={method.icon}
                                        title={
                                            <Space>
                                                {method.title}
                                                {method.tag && <span style={{ fontSize: '12px', background: '#e6f7ff', color: '#52c41a', padding: '2px 8px', borderRadius: '10px', border: '1px solid #b7eb8f' }}>{method.tag}</span>}
                                            </Space>
                                        }
                                        description={method.desc}
                                    />
                                </Card>
                            ))}
                        </Space>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ExamCreationPortal;