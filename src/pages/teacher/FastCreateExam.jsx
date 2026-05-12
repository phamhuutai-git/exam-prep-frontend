import React, { useState, useEffect } from "react";
import {
    Row, Col, Card, Input, Button, Form, Select,
    Space, Spin, InputNumber, Typography, Divider
} from "antd";
import {
    SendOutlined, ArrowLeftOutlined, ThunderboltOutlined,
    CheckCircleFilled, QuestionCircleOutlined, BulbOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examService from "../../services/teacher/examService";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

const FastCreateExam = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [rawText, setRawText] = useState("");
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    // 1. Load danh mục
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await examService.getAllCategory();
                setCategories(res.data?.data || []);
            } catch (err) {
                console.error("Lỗi tải danh mục:", err); // Sử dụng err để hết lỗi ESLint
            }
        };
        fetchCats();
    }, []);

    // 2. Logic Live Preview
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
                console.error("Lỗi bóc tách nội dung:", err);
            } finally {
                setLoading(false);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [rawText]);

    // 3. Click đáp án nhanh
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

    // 4. Lưu đề thi
    const onFinish = async (values) => {
        if (previewQuestions.length === 0) {
            toast.warning("Chưa có nội dung đề thi!");
            return;
        }

        setSubmitting(true);
        try {
            const selectedCat = categories.find(c => c.name === values.categoryName);

            // Format duration HH:mm:ss
            let formattedDuration = values.duration || "01:00:00";
            if (formattedDuration.split(":").length === 2) {
                formattedDuration += ":00";
            }

            const payload = {
                ...values,
                code: `EX-FAST-${Date.now()}`,
                duration: formattedDuration,
                categoryName: values.categoryName,
                categoryId: selectedCat ? selectedCat.id : null,
                rawText: rawText
            };

            await examService.createExamFast(payload);
            toast.success("Lưu đề thi thành công! 🚀");
            navigate("/teacher/exams");
        } catch (err) {
            console.error("Lỗi lưu đề:", err);
            toast.error(err.response?.data?.message || "Lưu đề thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: "15px", background: "#f0f2f5", minHeight: "100vh" }}>
            {/* Header */}
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
                    onClick={() => form.submit()}
                    loading={submitting}
                    size="large"
                    style={{ borderRadius: "6px", fontWeight: "bold" }}
                >
                    Lưu & Xuất bản đề
                </Button>
            </div>

            <Row gutter={16}>
                {/* Cột trái: Nhập liệu & Cấu hình */}
                <Col span={10}>
                    <Card style={{ marginBottom: "12px", borderRadius: "8px" }}>
                        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ duration: "01:00:00", passScore: 5 }}>
                            <Row gutter={12}>
                                <Col span={14}>
                                    <Form.Item name="title" label="Tên đề thi" rules={[{ required: true }]}>
                                        <Input placeholder="Tên đề..." />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item name="categoryName" label="Danh mục" rules={[{ required: true }]}>
                                        <Select placeholder="Chọn danh mục">
                                            {categories.map(cat => (
                                                <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item name="duration" label="Thời gian làm bài">
                                        <Input type="time" step="1" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="passScore" label="Điểm sàn (Pass)">
                                        <InputNumber min={0} max={10} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    <Card title={<Space><QuestionCircleOutlined /> Nội dung văn bản thô</Space>} style={{ borderRadius: "8px" }}>
                        <TextArea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Câu 1: ... A. ... *B. ... Giải thích: ..."
                            style={{
                                height: "450px",
                                fontFamily: "monospace",
                                fontSize: "15px",
                                border: "1px solid #d9d9d9",
                                borderRadius: "8px"
                            }}
                        />
                    </Card>
                </Col>

                {/* Cột phải: Preview */}
                <Col span={14}>
                    <Card
                        title={`Bản xem trước (${previewQuestions.length} câu)`}
                        style={{ height: "calc(100vh - 110px)", overflowY: "auto", borderRadius: "8px" }}
                    >
                        <Spin spinning={loading} tip="Đang bóc tách...">
                            {previewQuestions.map((q, idx) => (
                                <div key={idx} style={{
                                    marginBottom: "25px", background: "#fff", padding: "18px",
                                    borderRadius: "12px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                                }}>
                                    <Text strong style={{ fontSize: "16px", color: "#1890ff", display: "block", marginBottom: "12px" }}>
                                        Câu {idx + 1}: {q.content}
                                    </Text>
                                    <Row gutter={[16, 12]}>
                                        {q.answers?.map((ans, i) => {
                                            const isTrue = ans.isCorrect || ans.correct;
                                            return (
                                                <Col span={24} key={i}>
                                                    <div
                                                        onClick={() => handleToggleCorrect(idx, ans.label)}
                                                        style={{
                                                            padding: "10px 15px", borderRadius: "8px", border: isTrue ? "2px solid #52c41a" : "1px solid #d9d9d9",
                                                            background: isTrue ? "#f6ffed" : "#fff", cursor: "pointer", display: "flex", alignItems: "center"
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: 28, height: 28, borderRadius: "50%", background: isTrue ? "#52c41a" : "#f0f0f0",
                                                            color: isTrue ? "#fff" : "#595959", display: "flex", justifyContent: "center", alignItems: "center",
                                                            marginRight: 12, fontWeight: "bold"
                                                        }}>{ans.label}</div>
                                                        <Text style={{ flex: 1 }}>{ans.content}</Text>
                                                        {isTrue && <CheckCircleFilled style={{ color: "#52c41a" }} />}
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>

                                    {/* KHUNG GIẢI THÍCH */}
                                    {q.explanation && (
                                        <div style={{
                                            marginTop: "15px", padding: "12px 15px", background: "#fffbe6",
                                            borderRadius: "8px", borderLeft: "5px solid #ffe58f"
                                        }}>
                                            <Space style={{ marginBottom: 4 }}>
                                                <BulbOutlined style={{ color: "#d48806" }} />
                                                <Text strong style={{ color: "#856404" }}>Lời giải chi tiết:</Text>
                                            </Space>
                                            <br />
                                            <Text italic style={{ color: "#595959" }}>{q.explanation}</Text>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FastCreateExam;