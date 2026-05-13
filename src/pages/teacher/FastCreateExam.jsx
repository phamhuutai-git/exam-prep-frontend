import React, { useState, useEffect } from "react";
import {
    Row, Col, Card, Input, Button, Form, Select,
    Space, Spin, InputNumber, Typography, Divider, Modal
} from "antd";
import {
    SendOutlined, ArrowLeftOutlined, ThunderboltOutlined,
    CheckCircleFilled, BulbOutlined, EditOutlined, SettingOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examService from "../../services/teacher/examService";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

const FastCreateExam = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // --- States ---
    const [rawText, setRawText] = useState("");
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    // State điều khiển Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Load danh mục
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await examService.getAllCategory();
                setCategories(res.data?.data || []);
            } catch (err) {
                console.error("Lỗi tải danh mục:", err);
            }
        };
        fetchCats();
    }, []);

    // 2. Logic Live Preview (Debounce 600ms)
    useEffect(() => {
        if (!rawText.trim() || rawText.length < 10) {
            setPreviewQuestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await examService.parsePreview(rawText);
                setPreviewQuestions(res.data?.data || []);
            } catch (err) {
                console.error("Lỗi bóc tách:", err);
            } finally {
                setLoading(false);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [rawText]);

    // 3. Click bên trái -> Sửa dấu * bên phải
    const handleToggleCorrect = (qIdx, label) => {
        const lines = rawText.split("\n");
        let currentQ = -1;
        const newLines = lines.map((line) => {
            if (line.trim().toLowerCase().startsWith("câu")) currentQ++;
            if (currentQ === qIdx) {
                const trimmedLine = line.trim();
                const regex = new RegExp(`^\\*?${label}\\.`, "i");
                if (regex.test(trimmedLine)) {
                    return trimmedLine.startsWith("*") ? line.replace("*", "") : "*" + line;
                }
            }
            return line;
        });
        setRawText(newLines.join("\n"));
    };

    // 4. Mở Modal khi bấm nút Lưu
    const handleOpenSaveModal = () => {
        if (previewQuestions.length === 0) {
            toast.warning("Vui lòng nhập nội dung câu hỏi trước khi lưu!");
            return;
        }
        setIsModalOpen(true);
    };

    // 5. Xử lý lưu đề chính thức
    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const selectedCat = categories.find(c => c.name === values.categoryName);

            // Format duration HH:mm:ss
            let formattedDuration = values.duration || "01:00:00";
            if (formattedDuration.split(":").length === 2) formattedDuration += ":00";

            const payload = {
                ...values, // Đã bao gồm trường 'code' do giáo viên tự nhập
                duration: formattedDuration,
                categoryName: values.categoryName,
                categoryId: selectedCat ? selectedCat.id : null,
                rawText: rawText
            };

            await examService.createExamFast(payload);
            toast.success("Đề thi đã được tạo thành công rực rỡ! 🚀");
            navigate("/teacher/exams");
        } catch (err) {
            console.error("Lưu đề thất bại:", err);
            toast.error("Có lỗi xảy ra khi lưu đề thi");
        } finally {
            setSubmitting(false);
            setIsModalOpen(false);
        }
    };

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
                        <ThunderboltOutlined style={{ color: "#faad14" }} /> Soạn đề siêu tốc
                    </Title>
                </Space>

                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleOpenSaveModal}
                    size="large"
                    style={{ borderRadius: "6px", fontWeight: "bold" }}
                >
                    Lưu & Xuất bản đề
                </Button>
            </div>

            <Row gutter={16} style={{ height: "calc(100vh - 110px)" }}>
                {/* CỘT TRÁI: EDITOR */}
                <Col span={10} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Card
                        title={<Space><EditOutlined /> Nội dung văn bản</Space>}
                        style={{ flex: 1, borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden" }}
                        styles={{ body: { flex: 1, padding: 0, display: "flex" } }} // Fix AntD warning
                    >
                        <TextArea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            spellCheck={false}
                            placeholder={`Câu 1: Java là ngôn ngữ gì?\nA. Hướng thủ tục\n*B. Hướng đối tượng\nGiải thích: Vì Java hỗ trợ các tính chất OOP...`}
                            style={{
                                flex: 1,
                                border: "none",
                                resize: "none",
                                padding: "20px",
                                fontSize: "15px",
                                fontFamily: "'JetBrains Mono', monospace",
                                lineHeight: "1.6",
                                background: "#fafafa"
                            }}
                        />
                    </Card>
                </Col>

                {/* CỘT PHẢI: PREVIEW */}
                <Col span={14} style={{ height: "100%" }}>
                    <Card
                        title={`Bản xem trước (${previewQuestions.length} câu)`}
                        style={{ height: "100%", borderRadius: "8px", overflow: "hidden" }}
                        styles={{ body: { height: "calc(100% - 57px)", overflowY: "auto", padding: "20px" } }} // Fix AntD warning
                    >
                        <Spin spinning={loading} tip="Đang bóc tách dữ liệu...">
                            {previewQuestions.map((q, idx) => (
                                <div key={idx} style={{
                                    marginBottom: "25px", background: "#fff", padding: "18px",
                                    borderRadius: "12px", border: "1px solid #f0f0f0"
                                }}>
                                    <Text strong style={{ fontSize: "16px", color: "#1890ff", display: "block", marginBottom: "12px" }}>
                                        Câu {idx + 1}: {q.content}
                                    </Text>
                                    <Row gutter={[16, 12]}>
                                        {q.answers?.map((ans, i) => {
                                            const isTrue = ans.isCorrect || ans.correct;
                                            return (
                                                <Col span={24} key={i}>
                                                    <div onClick={() => handleToggleCorrect(idx, ans.label)}
                                                         style={{
                                                             padding: "10px 15px", borderRadius: "8px", border: isTrue ? "2px solid #52c41a" : "1px solid #d9d9d9",
                                                             background: isTrue ? "#f6ffed" : "#fff", cursor: "pointer", display: "flex", alignItems: "center"
                                                         }}>
                                                        <div style={{
                                                            width: 28, height: 28, borderRadius: "50%", background: isTrue ? "#52c41a" : "#f0f0f0",
                                                            color: isTrue ? "#fff" : "#595959", display: "flex", justifyContent: "center", alignItems: "center", marginRight: 12, fontWeight: "bold"
                                                        }}>{ans.label}</div>
                                                        <Text style={{ flex: 1 }}>{ans.content}</Text>
                                                        {isTrue && <CheckCircleFilled style={{ color: "#52c41a" }} />}
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                    {q.explanation && (
                                        <div style={{ marginTop: "15px", padding: "12px", background: "#fffbe6", borderRadius: "8px", borderLeft: "5px solid #ffe58f" }}>
                                            <Space style={{ marginBottom: 4 }}><BulbOutlined style={{ color: "#d48806" }} /><Text strong style={{ color: "#856404" }}>Lời giải chi tiết:</Text></Space>
                                            <br /><Text italic style={{ color: "#595959", fontSize: "14px" }}>{q.explanation}</Text>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Spin>
                    </Card>
                </Col>
            </Row>

            {/* MODAL CẤU HÌNH ĐỀ THI */}
            <Modal
                title={<Title level={4}><SettingOutlined /> Thông tin cấu hình đề thi</Title>}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={submitting}
                okText="Xác nhận & Xuất bản"
                cancelText="Quay lại sửa tiếp"
                width={650}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ duration: "01:00:00", passScore: 5, examType: "PRACTICE" }}
                >
                    {/* TRƯỜNG NHẬP MÃ ĐỀ THI */}
                    <Form.Item name="code" label="Mã đề thi" rules={[{ required: true, message: 'Vui lòng nhập mã đề thi!' }]}>
                        <Input placeholder="VD: TOAN-15-MIN" size="large" />
                    </Form.Item>

                    <Form.Item name="title" label="Tên đề thi" rules={[{ required: true, message: 'Hãy đặt tên cho đề thi của bạn!' }]}>
                        <Input placeholder="VD: Đề thi khảo sát chất lượng đầu năm" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="categoryName" label="Danh mục" rules={[{ required: true }]}>
                                <Select placeholder="Chọn danh mục" size="large">
                                    {categories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="examType" label="Loại hình đề thi">
                                <Select size="large">
                                    <Select.Option value="PRACTICE">Luyện tập</Select.Option>
                                    <Select.Option value="OFFICIAL">Chính thức</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="duration" label="Thời gian làm bài">
                                <Input type="time" step="1" size="large" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="passScore" label="Điểm sàn để vượt qua (Pass)">
                                <InputNumber min={0} max={10} style={{ width: "100%" }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default FastCreateExam;