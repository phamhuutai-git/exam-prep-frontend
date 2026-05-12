import React, { useState, useEffect } from "react";
import {
    Row, Col, Card, Input, Button, Form, Select,
    Space, InputNumber, Typography, Divider, Table, Tag, Badge
} from "antd";
import {
    SaveOutlined, ArrowLeftOutlined, DatabaseOutlined, SearchOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examService from "../../services/teacher/examService";
import questionService from "../../services/teacher/questionService";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const CreateFromBank = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // --- States ---
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 1. Khởi tạo dữ liệu (Load Danh mục và Câu hỏi)
    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                // Lấy danh mục
                const catRes = await examService.getAllCategory();
                setCategories(catRes.data?.data || []);

                // Lấy toàn bộ câu hỏi của giáo viên (tạm lấy size 1000 để dễ chọn)
                const qRes = await questionService.getQuestionsByTeacher({ page: 0, size: 1000 });
                const qList = qRes.data?.data?.content || [];
                setQuestions(qList);
                setFilteredQuestions(qList);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
                toast.error("Không thể tải ngân hàng câu hỏi!");
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    // 2. Logic Tìm kiếm và Lọc câu hỏi (Local Filter)
    useEffect(() => {
        let result = questions;
        if (searchText) {
            result = result.filter(q => q.content.toLowerCase().includes(searchText.toLowerCase()));
        }
        if (selectedCategory) {
            // Giả định backend trả về categoryName hoặc categoryId trong Question
            result = result.filter(q => q.categoryName === selectedCategory || q.categoryId === selectedCategory);
        }
        setFilteredQuestions(result);
    }, [searchText, selectedCategory, questions]);

    // 3. Xử lý khi chọn câu hỏi (Checkbox)
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    // 4. Lưu Đề Thi
    const onFinish = async (values) => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất 1 câu hỏi từ ngân hàng!");
            return;
        }

        setSubmitting(true);
        try {
            // Khớp payload với API createExam bạn đang có
            const payload = {
                title: values.title,
                code: `EX${Date.now()}`,
                duration: values.duration || "01:00:00",
                category: values.categoryName || "General", // Đổi 'categoryName' thành 'category' để khớp với Backend
                examType: values.examType || "PRACTICE",
                reviewAllowed: "TRUE",
                passScore: parseFloat(values.passScore) || 5.0,
                questionIds: selectedRowKeys
            };

            await examService.createExam(payload);
            toast.success("Xuất bản đề thi thành công! 🎉");
            navigate("/teacher/exams"); // Quay về danh sách đề thi
        } catch (err) {
            console.error("Lưu đề thất bại:", err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra khi xuất bản đề thi");
        } finally {
            setSubmitting(false);
        }
    };

    // --- Cấu hình Cột cho Bảng ---
    const columns = [
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <div style={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {text}
                </div>
            )
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficultyLevel',
            key: 'difficultyLevel',
            width: 120,
            render: (level) => {
                let color = 'blue';
                if (level === 'EASY') color = 'green';
                if (level === 'HARD') color = 'red';
                return <Tag color={color}>{level || 'MEDIUM'}</Tag>;
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt', // Tùy vào field backend trả về
            key: 'createdAt',
            width: 150,
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'
        }
    ];

    return (
        <div style={{ padding: "15px", background: "#f0f2f5", minHeight: "100vh" }}>
            {/* Header Bar */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "15px", background: "#fff", padding: "10px 20px",
                borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
                    <Divider type="vertical" />
                    <Title level={4} style={{ margin: 0 }}>
                        <DatabaseOutlined style={{ color: "#fa8c16" }} /> Nhặt câu hỏi từ Ngân hàng
                    </Title>
                </Space>

                <Space>
                    <Badge count={selectedRowKeys.length} showZero color="#52c41a">
                        <span style={{ marginRight: 15, fontWeight: 'bold', color: '#595959' }}>Câu hỏi đã chọn</span>
                    </Badge>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={submitting}
                        size="large"
                        style={{ borderRadius: "6px", fontWeight: "bold" }}
                    >
                        Lưu & Xuất bản
                    </Button>
                </Space>
            </div>

            <Row gutter={16} style={{ height: "calc(100vh - 110px)" }}>
                {/* CỘT TRÁI: THÔNG TIN ĐỀ THI */}
                <Col span={8} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Card style={{ flex: 1, borderRadius: "8px", overflowY: 'auto' }} title="Thông tin Đề thi">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{ duration: "01:00:00", passScore: 5, examType: "PRACTICE" }}
                        >
                            <Form.Item name="title" label="Tên đề thi" rules={[{ required: true, message: 'Vui lòng nhập tên đề!' }]}>
                                <Input placeholder="VD: Bài kiểm tra 15 phút Java" size="large" />
                            </Form.Item>

                            <Form.Item name="categoryName" label="Danh mục" rules={[{ required: true }]}>
                                <Select placeholder="Chọn danh mục" size="large">
                                    {categories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item name="duration" label="Thời gian làm bài">
                                        <Input type="time" step="1" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="passScore" label="Điểm Pass (0-10)">
                                        <InputNumber min={0} max={10} style={{ width: "100%" }} size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="examType" label="Loại hình thi">
                                <Select size="large">
                                    <Select.Option value="PRACTICE">Luyện tập (Cho phép xem lại)</Select.Option>
                                    <Select.Option value="OFFICIAL">Chính thức (Tính điểm xếp hạng)</Select.Option>
                                </Select>
                            </Form.Item>

                            <div style={{ marginTop: 30, padding: '15px', background: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                                <Text strong style={{ color: '#096dd9' }}>💡 Hướng dẫn:</Text>
                                <ul style={{ paddingLeft: 20, color: '#595959', marginTop: 10 }}>
                                    <li>Điền đầy đủ thông tin đề thi ở cột này.</li>
                                    <li>Tích chọn các câu hỏi bạn muốn đưa vào đề ở bảng bên phải.</li>
                                    <li>Nhấn "Lưu & Xuất bản" ở góc trên cùng.</li>
                                </ul>
                            </div>
                        </Form>
                    </Card>
                </Col>

                {/* CỘT PHẢI: BẢNG NGÂN HÀNG CÂU HỎI */}
                <Col span={16} style={{ height: "100%" }}>
                    <Card
                        title="Ngân hàng câu hỏi của bạn"
                        style={{ height: "100%", borderRadius: "8px", overflow: "hidden", display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflowY: "auto", padding: 0 }}
                        extra={
                            <Input
                                placeholder="Tìm kiếm nội dung câu hỏi..."
                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250, borderRadius: 20 }}
                            />
                        }
                    >
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredQuestions}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            size="middle"
                            scroll={{ y: 'calc(100vh - 300px)' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateFromBank;