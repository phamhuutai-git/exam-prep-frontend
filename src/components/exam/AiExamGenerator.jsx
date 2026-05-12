import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, Select, message, Space, Card, Typography } from 'antd';
import { RobotOutlined, BulbOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function AiExamGenerator({ onGenerateSuccess }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/ai/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Lỗi kết nối đến máy chủ AI');
            }

            const text = await response.text();

            // --- BỘ LỌC JSON SIÊU CẤP ---
            let cleanJson = text;
            // 1. Xóa bỏ thẻ markdown nếu có
            cleanJson = cleanJson.replace(/```json/gi, '').replace(/```/g, '').trim();

            // 2. Quét tìm và chỉ cắt lấy đúng phần mảng [...] (Loại bỏ mọi chữ rác AI viết thêm ở đầu/cuối)
            const firstBracket = cleanJson.indexOf('[');
            const lastBracket = cleanJson.lastIndexOf(']');

            if (firstBracket !== -1 && lastBracket !== -1) {
                cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
            }

            let generatedQuestions = [];
            try {
                // Cố gắng chuyển thành chuỗi JSON
                generatedQuestions = JSON.parse(cleanJson);
            } catch (parseError) {
                console.error("Chuỗi bị lỗi JSON:", cleanJson);
                // Cảnh báo thân thiện thay vì làm sập màn hình trắng
                message.warning("AI vừa tạo ra nội dung chứa ký tự đặc biệt làm hỏng định dạng. Vui lòng thử tạo lại!");
                setLoading(false);
                return;
            }
            // ----------------------------

            message.success(`Tuyệt vời! Đã biên soạn xong ${generatedQuestions.length} câu hỏi.`);

            if (onGenerateSuccess) {
                onGenerateSuccess(generatedQuestions);
            }

            form.resetFields();
        } catch (error) {
            console.error("Lỗi tạo đề:", error);
            message.error('Không thể tạo câu hỏi lúc này. Vui lòng kiểm tra lại mạng hoặc server!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{ background: '#f9f0ff', borderColor: '#d3adf7', marginBottom: 16 }}
            styles={{ body: { padding: 16 } }}
        >
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BulbOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                <Text strong style={{ color: '#722ed1', fontSize: 16 }}>
                    Sinh câu hỏi tự động bằng AI
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ quantity: 5, difficulty: 'MEDIUM' }}
            >
                <Form.Item
                    name="promptText"
                    label="Chủ đề hoặc Nội dung bài học"
                    rules={[{ required: true, message: 'Vui lòng nhập chủ đề muốn tạo!' }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="VD: Lập trình Java cơ bản, Biến và kiểu dữ liệu..."
                    />
                </Form.Item>

                <Space size="large" style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
                    <Form.Item
                        name="quantity"
                        label="Số lượng câu hỏi"
                        rules={[{ required: true, message: 'Nhập số lượng!' }]}
                    >
                        <InputNumber min={1} max={30} style={{ width: 150 }} />
                    </Form.Item>

                    <Form.Item
                        name="difficulty"
                        label="Độ khó"
                        rules={[{ required: true, message: 'Chọn độ khó!' }]}
                    >
                        <Select style={{ width: 150 }}>
                            <Select.Option value="EASY">Dễ</Select.Option>
                            <Select.Option value="MEDIUM">Trung bình</Select.Option>
                            <Select.Option value="HARD">Khó</Select.Option>
                        </Select>
                    </Form.Item>
                </Space>

                <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<RobotOutlined />}
                        style={{ background: '#722ed1', borderColor: '#722ed1' }}
                    >
                        {loading ? 'AI đang biên soạn...' : 'Bắt đầu tạo'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
}