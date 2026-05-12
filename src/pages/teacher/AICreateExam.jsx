import React, { useState, useEffect } from "react";
import {
    Row, Col, Card, Input, Button, Form, Select,
    Space, Spin, InputNumber, Typography, Divider
} from "antd";
import {
    SendOutlined, ArrowLeftOutlined, RobotOutlined,
    CheckCircleFilled, BulbOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examService from "../../services/teacher/examService";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AICreateExam = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [prompt, setPrompt] = useState("");
    const [numQuestions, setNumQuestions] = useState(10);
    const [rawText, setRawText] = useState("");
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingParser, setLoadingParser] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await examService.getAllCategory();
                setCategories(res.data?.data || []);
            } catch (error) { console.error("Lỗi danh mục:", error); }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (!rawText || !rawText.trim() || rawText.length < 10) {
            setPreviewQuestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            setLoadingParser(true);
            try {
                const res = await examService.parsePreview(rawText);
                setPreviewQuestions(res.data?.data || []);
            } catch (error) { console.error(error); }
            finally { setLoadingParser(false); }
        }, 600);
        return () => clearTimeout(timer);
    }, [rawText]);

    const handleGenerateAI = async () => {
        if (!prompt.trim()) {
            toast.warning("Vui lòng nhập chủ đề cho AI!");
            return;
        }
        setLoadingAI(true);
        setRawText("");
        try {
            const response = await examService.generateFromAI({
                promptText: prompt,
                quantity: numQuestions,
                difficulty: "MEDIUM"
            });
            setRawText(response.data);
            toast.success(`AI đã tạo xong ${numQuestions} câu hỏi!`);
        } catch (error) {
            console.error(error);
            toast.error("AI đang bận, thử lại sau nhé!");
        } finally {
            setLoadingAI(false);
        }
    };

    const handleToggleCorrect = (qIdx, label) => {
        if (!rawText) return;
        const lines = rawText.split("\n");
        let currentQ = -1;
        const newLines = lines.map((line) => {
            if (line.trim().toLowerCase().startsWith("câu")) currentQ++;
            if (currentQ === qIdx) {
                const trimmedLine = line.trim();
                const regex = new RegExp(`^\\*?${label}\\.`, "i");
                if (regex.test(trimmedLine)) return trimmedLine.startsWith("*") ? line.replace("*", "") : "*" + line;
            }
            return line;
        });
        setRawText(newLines.join("\n"));
    };

    const onFinish = async (values) => {
        if (previewQuestions.length === 0) return toast.warning("Chưa có nội dung!");
        setSubmitting(true);
        try {
            const selectedCat = categories.find(c => c.name === values.categoryName);

            // Format duration HH:mm:ss
            let formattedDuration = values.duration || "00:45:00";
            if (formattedDuration.split(":").length === 2) formattedDuration += ":00";

            const payload = {
                ...values,
                code: `EX-AI-${Date.now()}`,
                duration: formattedDuration,
                categoryName: values.categoryName,
                categoryId: selectedCat ? selectedCat.id : null,
                rawText: rawText
            };
            await examService.createExamFast(payload);
            toast.success("Lưu đề AI thành công! 🚀");
            navigate("/teacher/exams");
        } catch (error) { toast.error("Lưu đề thất bại!"); console.error(error); }
        finally { setSubmitting(false); }
    };

    return (
        <div style={{ padding: "15px", background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", background: "#fff", padding: "10px 20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
                    <Divider type="vertical" />
                    <Title level={4} style={{ margin: 0, color: '#722ed1' }}><RobotOutlined /> Trợ lý AI tạo đề</Title>
                </Space>
                <Button type="primary" icon={<SendOutlined />} onClick={() => form.submit()} loading={submitting} size="large" style={{ background: '#722ed1', borderColor: '#722ed1' }}>Lưu & Xuất bản đề AI</Button>
            </div>

            <Row gutter={16} style={{ height: "calc(100vh - 110px)" }}>
                <Col span={10} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    {/* Card Nhập Lệnh AI */}
                    <Card title={<Space><BulbOutlined style={{ color: '#722ed1' }}/> Yêu cầu AI tạo nội dung</Space>} style={{ marginBottom: "12px", borderRadius: "8px", border: '1px solid #d3adf7' }}>
                        <TextArea rows={2} placeholder="Nhập chủ đề..." value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ marginBottom: 15 }} />
                        <Row gutter={12} align="middle">
                            <Col span={10}><Text strong>Số lượng:</Text></Col>
                            <Col span={14}><InputNumber min={1} max={50} value={numQuestions} onChange={setNumQuestions} style={{ width: '100%' }} /></Col>
                        </Row>
                        <Button type="primary" block icon={<RobotOutlined />} loading={loadingAI} onClick={handleGenerateAI} style={{ marginTop: 15, background: 'linear-gradient(90deg, #722ed1 0%, #b37feb 100%)', border: 'none' }}>Tạo ngay</Button>
                    </Card>

                    {/* Card Cấu hình - ĐÃ THÊM CÁC TRƯỜNG CÒN THIẾU */}
                    <Card style={{ flex: 1, borderRadius: "8px", overflowY: "auto" }} title="Thông tin cấu hình">
                        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ duration: "00:45:00", passScore: 5, examType: "PRACTICE" }}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item name="title" label="Tên đề thi" rules={[{ required: true }]}><Input placeholder="Tên đề..." /></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="categoryName" label="Danh mục" rules={[{ required: true }]}>
                                        <Select placeholder="Chọn">{categories.map(cat => <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>)}</Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={12}>
                                <Col span={8}>
                                    <Form.Item name="duration" label="Thời gian"><Input type="time" step="1" /></Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="passScore" label="Điểm Pass"><InputNumber min={0} max={10} style={{ width: "100%" }} /></Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="examType" label="Loại đề">
                                        <Select>
                                            <Select.Option value="PRACTICE">Luyện tập</Select.Option>
                                            <Select.Option value="OFFICIAL">Chính thức</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Text strong style={{ color: '#595959', fontSize: '12px' }}>Văn bản thô (Có thể sửa lời giải tại đây):</Text>
                        <TextArea value={rawText} onChange={(e) => setRawText(e.target.value)} style={{ marginTop: 8, height: 120, fontFamily: "monospace", fontSize: '12px' }} />
                    </Card>
                </Col>

                <Col span={14} style={{ height: "100%" }}>
                    <Card title={`Bản xem trước (${previewQuestions.length} câu)`} style={{ height: "100%", borderRadius: "8px" }} bodyStyle={{ height: "calc(100% - 57px)", overflowY: "auto", padding: "20px" }}>
                        <Spin spinning={loadingParser || loadingAI} tip="Đang chuẩn bị dữ liệu...">
                            {previewQuestions.map((q, idx) => (
                                <div key={idx} style={{ marginBottom: "25px", background: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
                                    <Text strong style={{ fontSize: "15px", color: "#722ed1", display: "block", marginBottom: "12px" }}>Câu {idx + 1}: {q.content}</Text>
                                    <Row gutter={[16, 12]}>
                                        {q.answers?.map((ans, i) => {
                                            const isTrue = ans.isCorrect || ans.correct;
                                            return (
                                                <Col span={24} key={i}>
                                                    <div onClick={() => handleToggleCorrect(idx, ans.label)} style={{ padding: "10px 15px", borderRadius: "8px", border: isTrue ? "2px solid #52c41a" : "1px solid #d9d9d9", background: isTrue ? "#f6ffed" : "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: isTrue ? "#52c41a" : "#f0f0f0", color: isTrue ? "#fff" : "#595959", display: "flex", justifyContent: "center", alignItems: "center", marginRight: 12, fontWeight: "bold" }}>{ans.label}</div>
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
                                            <br /><Text italic style={{ color: "#595959", fontSize: "13px" }}>{q.explanation}</Text>
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

export default AICreateExam;