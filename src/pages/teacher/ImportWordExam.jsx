import React, { useState, useEffect } from 'react';
import {
    Card, Button, Upload, Typography, Space, Modal, Input,
    Form, Select, Spin, Row, Col, Divider, InputNumber // Bổ sung InputNumber ở đây
} from 'antd';
import {
    FileWordOutlined, ArrowLeftOutlined, SendOutlined,
    EyeOutlined, InboxOutlined, EditOutlined,
    CheckCircleFilled, BulbOutlined, SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import _ from 'lodash';
import examService from "../../services/teacher/examService";

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

const ImportWordExam = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [rawText, setRawText] = useState('');
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    // 1. Load danh mục từ Backend
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

    // 2. Hàm tạo text thô từ mảng câu hỏi
    const generateRawText = (questions) => {
        return questions.map((q, i) => {
            let text = `Câu ${i + 1}: ${q.content}\n`;
            if (q.answers) {
                q.answers.forEach((a, index) => {
                    const label = a.label || String.fromCharCode(65 + index);
                    text += `${a.isCorrect ? '*' : ''}${label}. ${a.content}\n`;
                });
            }
            if (q.explanation) text += `Giải thích: ${q.explanation}\n`;
            return text;
        }).join('\n');
    };

    // 3. Upload và bóc tách lấy Preview
    const handleFileUpload = async (info) => {
        const fileObj = info.file;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', fileObj);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8080/api/teacher/questions/import-word-preview', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const questions = res.data.data || [];
            setRawText(generateRawText(questions));
            setPreviewQuestions(questions);
            setStep(2);
            toast.success("Bóc tách thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi bóc tách file Word.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Debounce khi gõ văn bản
    const debouncedParse = _.debounce(async (text) => {
        if (!text.trim()) return;
        setParsing(true);
        try {
            const res = await examService.parsePreview(text);
            setPreviewQuestions(res.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setParsing(false);
        }
    }, 600);

    const handleTextChange = (e) => {
        const text = e.target.value;
        setRawText(text);
        debouncedParse(text);
    };

    // 5. Click chọn đáp án đúng bên Preview
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
        const newText = newLines.join("\n");
        setRawText(newText);
        debouncedParse(newText);
    };

    // 6. Mở Modal
    const handleOpenSaveModal = () => {
        if (previewQuestions.length === 0) {
            toast.warning("Chưa có nội dung câu hỏi!");
            return;
        }
        setIsModalOpen(true);
    };

    // 7. Lưu Data (Có cho phép nhập Mã đề)
    const handleFinalSave = async (values) => {
        setLoading(true);
        try {
            const selectedCat = categories.find(c => c.name === values.categoryName);
            let formattedDuration = values.duration || "01:00:00";
            if (formattedDuration.split(":").length === 2) formattedDuration += ":00";

            const payload = {
                ...values, // values nay đã bao gồm cả 'code' và 'passScore'
                duration: formattedDuration,
                categoryName: values.categoryName,
                categoryId: selectedCat ? selectedCat.id : null,
                rawText: rawText
            };

            await examService.createExamFast(payload);
            toast.success("Tạo đề thi thành công!");
            navigate('/teacher/exams');
        } catch (err) {
            console.error("Lưu đề thất bại:", err);
            toast.error("Có lỗi xảy ra khi lưu đề thi.");
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div style={{ padding: "15px", background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "15px", background: "#fff", padding: "10px 20px",
                borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => step === 1 ? navigate(-1) : setStep(1)}>Quay lại</Button>
                    <Divider type="vertical" />
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                        <FileWordOutlined /> Biên tập đề từ Word
                    </Title>
                </Space>

                {step === 2 && (
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleOpenSaveModal}
                        size="large"
                        style={{ borderRadius: "6px", fontWeight: "bold" }}
                    >
                        Lưu & Xuất bản đề
                    </Button>
                )}
            </div>

            {step === 1 ? (
                <div className="max-w-4xl mx-auto mt-16">
                    <Card bordered={false} style={{ borderRadius: "12px", textAlign: "center", padding: "40px" }} className="shadow-sm">
                        <Spin spinning={loading} tip="Đang đọc file Word...">
                            <Dragger
                                multiple={false} accept=".docx" showUploadList={false}
                                beforeUpload={() => false} onChange={handleFileUpload}
                                style={{ padding: "40px", background: "#fafafa", borderRadius: "12px", border: "2px dashed #91d5ff" }}
                            >
                                <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#1890ff', fontSize: 64 }} /></p>
                                <Title level={3} className="mt-4">Kéo thả file Word vào đây</Title>
                                <Text style={{ color: "#8c8c8c", fontSize: "16px" }}>Hỗ trợ định dạng .docx bóc tách tự động</Text>
                                <div className="mt-8"><Button type="primary" size="large" style={{ borderRadius: "6px" }}>Chọn tệp từ máy tính</Button></div>
                            </Dragger>
                        </Spin>
                    </Card>
                </div>
            ) : (
                <Row gutter={16} style={{ height: "calc(100vh - 110px)" }}>
                    <Col span={10} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <Card
                            title={<Space><EditOutlined /> Nội dung văn bản (Có thể sửa trực tiếp)</Space>}
                            style={{ flex: 1, borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden" }}
                            styles={{ body: { flex: 1, padding: 0, display: "flex" } }}
                        >
                            <TextArea
                                value={rawText}
                                onChange={handleTextChange}
                                spellCheck={false}
                                style={{
                                    flex: 1, border: "none", resize: "none", padding: "20px",
                                    fontSize: "15px", fontFamily: "'JetBrains Mono', monospace",
                                    lineHeight: "1.6", background: "#fafafa"
                                }}
                            />
                        </Card>
                    </Col>

                    <Col span={14} style={{ height: "100%" }}>
                        <Card
                            title={<Space><EyeOutlined /> Bản xem trước ({previewQuestions.length} câu)</Space>}
                            style={{ height: "100%", borderRadius: "8px", overflow: "hidden" }}
                            styles={{ body: { height: "calc(100% - 57px)", overflowY: "auto", padding: "20px", background: "#f9fafb" } }}
                        >
                            <Spin spinning={parsing} tip="Đang cập nhật dữ liệu...">
                                {previewQuestions.length > 0 ? previewQuestions.map((q, idx) => (
                                    <div key={idx} style={{
                                        marginBottom: "25px", background: "#fff", padding: "20px",
                                        borderRadius: "12px", border: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                                    }}>
                                        <Text strong style={{ fontSize: "16px", color: "#1890ff", display: "block", marginBottom: "16px" }}>
                                            Câu {idx + 1}: {q.content}
                                        </Text>
                                        <Row gutter={[16, 12]}>
                                            {q.answers?.map((ans, i) => {
                                                const isTrue = ans.isCorrect || ans.correct;
                                                const label = ans.label || String.fromCharCode(65 + i);
                                                return (
                                                    <Col span={24} key={i}>
                                                        <div onClick={() => handleToggleCorrect(idx, label)}
                                                             style={{
                                                                 padding: "10px 15px", borderRadius: "8px", border: isTrue ? "2px solid #52c41a" : "1px solid #d9d9d9",
                                                                 background: isTrue ? "#f6ffed" : "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                                                                 transition: "all 0.3s ease"
                                                             }}>
                                                            <div style={{
                                                                width: 28, height: 28, borderRadius: "50%", background: isTrue ? "#52c41a" : "#f0f0f0",
                                                                color: isTrue ? "#fff" : "#595959", display: "flex", justifyContent: "center", alignItems: "center", marginRight: 12, fontWeight: "bold"
                                                            }}>{label}</div>
                                                            <Text style={{ flex: 1, color: isTrue ? "#237804" : "#595959", fontWeight: isTrue ? "500" : "normal" }}>
                                                                {ans.content}
                                                            </Text>
                                                            {isTrue && <CheckCircleFilled style={{ color: "#52c41a", fontSize: "18px" }} />}
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                        {q.explanation && (
                                            <div style={{ marginTop: "16px", padding: "14px", background: "#fffbe6", borderRadius: "8px", borderLeft: "5px solid #ffe58f" }}>
                                                <Space style={{ marginBottom: 4 }}><BulbOutlined style={{ color: "#d48806", fontSize: "16px" }} /><Text strong style={{ color: "#856404" }}>Lời giải chi tiết:</Text></Space>
                                                <br /><Text italic style={{ color: "#595959", fontSize: "14px" }}>{q.explanation}</Text>
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div style={{ textAlign: "center", marginTop: "100px", color: "#d9d9d9" }}>
                                        <FileWordOutlined style={{ fontSize: "64px" }} />
                                        <p style={{ marginTop: "16px", fontSize: "16px" }}>Chưa có dữ liệu. Vui lòng tải file Word lên.</p>
                                    </div>
                                )}
                            </Spin>
                        </Card>
                    </Col>
                </Row>
            )}

            <Modal
                title={<Title level={4}><SettingOutlined /> Thông tin cấu hình đề thi</Title>}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
                okText="Xác nhận & Xuất bản"
                cancelText="Quay lại sửa tiếp"
                width={650}
            >
                {/* Đã bổ sung passScore: 5 vào initialValues */}
                <Form form={form} layout="vertical" onFinish={handleFinalSave} initialValues={{ duration: "01:00:00", examType: "PRACTICE", passScore: 5 }}>

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
                        {/* TRƯỜNG ĐIỂM SÀN PASS SCORE */}
                        <Col span={12}>
                            <Form.Item name="passScore" label="Điểm sàn (Pass)">
                                <InputNumber min={0} max={10} style={{ width: "100%" }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ImportWordExam;