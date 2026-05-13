import React from 'react';
import { Row, Col, Card, Typography, Space, Button, Tag } from 'antd';
import {
    EditOutlined, FileWordOutlined, FileExcelOutlined,
    RobotOutlined, ArrowLeftOutlined, DatabaseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ExamCreationPortal = () => {
    const navigate = useNavigate();

    // Mảng chứa 5 phương thức tạo đề của Quang
    const methods = [
        {
            id: 'manual',
            title: 'Tự soạn đề thi / Bài tập',
            desc: 'Sử dụng trình soạn thảo bóc tách của hệ thống. Chỉnh sửa và gõ nội dung nhanh chóng.',
            icon: <EditOutlined style={{ fontSize: 36, color: '#1890ff' }} />,
            path: '/teacher/exams/fast-create',
            tagText: 'Phổ biến',
            tagColor: 'green'
        },
        {
            id: 'bank',
            title: 'Tạo từ ngân hàng câu hỏi',
            desc: 'Lựa chọn, xáo trộn các câu hỏi đã có sẵn trong hệ thống để tạo thành một đề thi mới.',
            icon: <DatabaseOutlined style={{ fontSize: 36, color: '#fa8c16' }} />,
            path: '/teacher/exams/from-bank',
            tagText: 'Khuyên dùng',
            tagColor: 'green'
        },
        {
            id: 'word',
            title: 'Tạo đề từ file Microsoft Word',
            desc: 'Hỗ trợ bóc tách từ file .doc, .docx. Tự động nhận diện câu hỏi và đáp án.',
            icon: <FileWordOutlined style={{ fontSize: 36, color: '#2b579a' }} />,
            path: '/teacher/exams/import-word',
            tagText: 'Mới',
            tagColor: 'blue'
        },
        {
            id: 'ai',
            title: 'Tạo đề thi bằng Trí tuệ nhân tạo (AI)',
            desc: 'Chỉ cần nhập chủ đề, AI sẽ tự động tạo bộ câu hỏi chất lượng cho bạn.',
            icon: <RobotOutlined style={{ fontSize: 36, color: '#722ed1' }} />,
            path: '/teacher/exams/ai-create',
            tagText: 'AI',
            tagColor: 'purple'
        },
        {
            id: 'excel',
            title: 'Tạo đề từ file Excel',
            desc: 'Phù hợp cho các bộ đề có số lượng câu hỏi cực lớn.',
            icon: <FileExcelOutlined style={{ fontSize: 36, color: '#217346' }} />,
            path: '/teacher/exams/import-excel',
            tagText: '', // Không có tag
            tagColor: ''
        }
    ];

    return (
        <div style={{ padding: '40px', background: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Nút Quay lại */}
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/teacher/exams')}
                    style={{ marginBottom: 40, borderRadius: '8px' }}
                    size="large"
                >
                    Quay lại
                </Button>

                {/* Tiêu đề */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <Title level={2} style={{ fontWeight: 700 }}>Tạo đề mới</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>Chọn một phương thức để bắt đầu tạo nội dung kiểm tra</Text>
                </div>

                {/* Lưới chứa các nút (Đã căn giữa justify="center") */}
                <Row gutter={[24, 24]} justify="center">
                    {methods.map(method => (
                        <Col xs={24} md={12} key={method.id}>
                            <Card
                                hoverable
                                onClick={() => navigate(method.path)}
                                style={{ borderRadius: 16, border: '1px solid #f0f0f0', height: '100%' }}
                                styles={{ body: { padding: '24px' } }}
                                className="portal-card-hover"
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    {/* Icon */}
                                    <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {method.icon}
                                    </div>

                                    {/* Text */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                            <Title level={5} style={{ margin: 0 }}>{method.title}</Title>
                                            {method.tagText && (
                                                <Tag color={method.tagColor} style={{ borderRadius: '4px', margin: 0 }}>
                                                    {method.tagText}
                                                </Tag>
                                            )}
                                        </div>
                                        <Text style={{ color: '#8c8c8c', fontSize: '14px', lineHeight: '1.5' }}>
                                            {method.desc}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* CSS tạo hiệu ứng nảy lên khi di chuột */}
            <style dangerouslySetInnerHTML={{__html: `
                .portal-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                    border-color: #1890ff !important;
                    transition: all 0.3s ease;
                }
            `}} />
        </div>
    );
};

export default ExamCreationPortal;