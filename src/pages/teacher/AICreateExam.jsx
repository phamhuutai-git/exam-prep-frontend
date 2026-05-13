import React, { useState, useEffect } from "react";
import {
    Row, Col, Card, Input, Button, Form, Select,
    Space, Spin, InputNumber, Typography, Divider, Modal
} from "antd";
import {
    SendOutlined, ArrowLeftOutlined, RobotOutlined,
    CheckCircleFilled, BulbOutlined, SettingOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examService from "../../services/teacher/examService";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AICreateExam = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // --- States ---
    const [prompt, setPrompt] = useState("");
    const [numQuestions, setNumQuestions] = useState(10);
    const [rawText, setRawText] = useState("");
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingParser, setLoadingParser] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    // State điều khiển Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await examService.getAllCategory();
                setCategories(res.data?.data || []);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
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
            } catch (error) {
                console.error("Lỗi parse preview:", error);
            }
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
            toast.success("AI đã tạo xong câu hỏi!");
        } catch (error) {
            console.error("Lỗi khi gọi AI:", error); // FIX ESLint
            toast.error("AI đang bận, thử lại sau nhé!");
        } finally {
            setLoadingAI(false);
        }
    };

    const handleToggleCorrect = (qIdx, label) => {
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

    // Hàm mở Modal khi nhấn nút Lưu
    const handleOpenSaveModal = () => {
        if (previewQuestions.length === 0) {
            toast.warning("Hãy nhờ AI tạo nội dung trước khi lưu!");
            return;
        }
        setIsModalOpen(true);
    };

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const selectedCat = categories.find(c => c.name === values.categoryName);
            let formattedDuration = values.duration || "00:45:00";
            if (formattedDuration.split(":").length === 2) formattedDuration += ":00";

            const payload = {
                ...values, // Lấy luôn code từ form, không tự sinh nữa
                duration: formattedDuration,
                categoryName: values.categoryName,
                categoryId: selectedCat ? selectedCat.id : null,
                rawText: rawText
            };
            await examService.createExamFast(payload);
            toast.success("Đề thi đã được xuất bản thành công! 🚀");
            navigate("/teacher/exams");
        } catch (error) {
            console.error("Lưu đề thất bại:", error); // FIX ESLint
            toast.error("Lưu đề thất bại!");
        } finally {
            setSubmitting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div style={{ padding: "15px", background: "#f0f2f5", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", background: "#fff", padding: "10px 20px", borderRadius: "8px" }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
                    <Divider type="vertical" />
                    <Title level={4} style={{ margin: 0, color: '#722ed1' }}><RobotOutlined /> Trợ lý AI tạo đề</Title>
                </Space>
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleOpenSaveModal}
                    size="large"
                    style={{ background: '#722ed1', borderColor: '#722ed1', fontWeight: 'bold' }}
                >
                    Lưu & Xuất bản đề AI
                </Button>
            </div>

            <Row gutter={16} style={{ height: "calc(100vh - 110px)" }}>
                {/* Cột trái: Tập trung vào Nhập lệnh và Nội dung thô */}
                <Col span={10} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Card title={<Space><BulbOutlined style={{ color: '#722ed1' }}/> Yêu cầu AI</Space>} style={{ marginBottom: "12px", borderRadius: "8px" }}>
                        <TextArea rows={2} placeholder="Nhập chủ đề..." value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ marginBottom: 10 }} />
                        <Row gutter={12} align="middle">
                            <Col span={8}><Text strong>Số lượng:</Text></Col>
                            <Col span={8}><InputNumber min={1} max={50} value={numQuestions} onChange={setNumQuestions} style={{ width: '100%' }} /></Col>
                            <Col span={8}><Button type="primary" block loading={loadingAI} onClick={handleGenerateAI} style={{ background: '#722ed1', border: 'none' }}>Tạo ngay</Button></Col>
                        </Row>
                    </Card>

                    <Card
                        title={<Space><SettingOutlined /> Nội dung văn bản thô (Có thể sửa trực tiếp)</Space>}
                        style={{ flex: 1, borderRadius: "8px", display: "flex", flexDirection: "column" }}
                        bodyStyle={{ flex: 1, padding: 0, display: "flex" }}
                    >
                        <TextArea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            style={{
                                flex: 1, border: "none", resize: "none", padding: "20px",
                                fontSize: "15px", fontFamily: "monospace", background: "#fafafa"
                            }}
                        />
                    </Card>
                </Col>

                {/* Cột phải: Preview */}
                <Col span={14} style={{ height: "100%" }}>
                    <Card title={`Bản xem trước dữ liệu AI (${previewQuestions.length} câu)`} style={{ height: "100%", borderRadius: "8px" }} bodyStyle={{ height: "calc(100% - 57px)", overflowY: "auto", padding: "20px" }}>
                        <Spin spinning={loadingParser || loadingAI}>
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
                                            <Space><BulbOutlined style={{ color: "#d48806" }} /><Text strong style={{ color: "#856404" }}>Lời giải chi tiết:</Text></Space>
                                            <br /><Text italic style={{ color: "#595959", fontSize: "13px" }}>{q.explanation}</Text>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Spin>
                    </Card>
                </Col>
            </Row>

            {/* MODAL CẤU HÌNH ĐỀ THI - XUẤT HIỆN KHI BẤM LƯU */}
            <Modal
                title={<Title level={4}><SettingOutlined /> Hoàn tất thông tin đề thi</Title>}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={submitting}
                okText="Xác nhận & Lưu đề"
                cancelText="Quay lại sửa tiếp"
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ duration: "00:45:00", passScore: 5, examType: "PRACTICE" }}>

                    {/* TRƯỜNG NHẬP MÃ ĐỀ THI */}
                    <Form.Item name="code" label="Mã đề thi" rules={[{ required: true, message: 'Vui lòng nhập mã đề thi!' }]}>
                        <Input placeholder="VD: AI-TEST-01" />
                    </Form.Item>

                    <Form.Item name="title" label="Tên đề thi" rules={[{ required: true, message: 'Vui lòng nhập tên đề!' }]}>
                        <Input placeholder="VD: Kiểm tra Lịch sử 1975-1990" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="categoryName" label="Danh mục" rules={[{ required: true }]}>
                                <Select placeholder="Chọn danh mục">
                                    {categories.map(cat => <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="examType" label="Loại hình đề thi">
                                <Select>
                                    <Select.Option value="PRACTICE">Luyện tập</Select.Option>
                                    <Select.Option value="OFFICIAL">Chính thức</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="duration" label="Thời gian làm bài">
                                <Input type="time" step="1" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="passScore" label="Điểm sàn (Pass)">
                                <InputNumber min={0} max={10} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AICreateExam;