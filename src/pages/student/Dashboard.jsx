import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboardList,
    faStar,
    faClock
} from '@fortawesome/free-solid-svg-icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
// Import hàm gọi API đã có sẵn của bạn
import { getAttemptsByExamType } from '../../services/student/studentServices';



const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalExams: 0, avgScore: 0, totalHours: 0 });
    const [chartData, setChartData] = useState([]);

    // ================= LẤY DỮ LIỆU THẬT TỪ API =================
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Kéo lịch sử của cả THI THẬT và LUYỆN TẬP về
                const [resOfficial, resPractice] = await Promise.all([
                    getAttemptsByExamType("OFFICIAL", { page: 0, size: 100 }),
                    getAttemptsByExamType("PRACTICE", { page: 0, size: 100 })
                ]);

                const officialData = resOfficial?.data?.data?.content || resOfficial?.data?.content || [];
                const practiceData = resPractice?.data?.data?.content || resPractice?.data?.content || [];

                // Gộp chung 2 mảng lại
                let allAttempts = [...officialData, ...practiceData];

                if (allAttempts.length > 0) {
                    // 1. TÍNH TOÁN CÁC CON SỐ THỐNG KÊ (Cho 3 thẻ Card)
                    const totalExams = allAttempts.length;
                    const totalScore = allAttempts.reduce((sum, item) => sum + (item.score || 0), 0);
                    const avgScore = (totalScore / totalExams).toFixed(1); // Cắt lấy 1 số thập phân

                    const totalSeconds = allAttempts.reduce((sum, item) => sum + (item.timeSpentSeconds || 0), 0);
                    const totalHours = (totalSeconds / 3600).toFixed(1); // Đổi từ giây ra giờ

                    setStats({ totalExams, avgScore, totalHours });

                    // 2. CHUẨN BỊ DỮ LIỆU CHO BIỂU ĐỒ (Line Chart)
                    // Sắp xếp lại theo thời gian từ cũ tới mới để vẽ đường biểu đồ đi tới
                    allAttempts.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                    // Chỉ lấy 15 bài gần nhất để biểu đồ không bị nhằng nhịt, chen chúc
                    const recentAttempts = allAttempts.slice(-15);

                    // ... code lấy recentAttempts ở trên giữ nguyên

                    // SỬA LẠI ĐOẠN NÀY:
                    const mappedChartData = recentAttempts.map((item, index) => {
                        const shortName = item.exam?.title?.substring(0, 10) || 'Bài thi';
                        return {
                            // Gắn thêm số thứ tự (#1, #2...) vào đuôi để tên không bao giờ bị trùng nhau
                            name: `${shortName}... #${index + 1}`,
                            score: Number((item.score || 0).toFixed(1))
                        };
                    });

                    setChartData(mappedChartData);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Cột cho bảng Danh sách bài thi cần làm
    const columns = [
        {
            title: 'Tên bài thi',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Hạn nộp',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (text) => <span style={{ color: '#d4380d' }}>{text}</span>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let color = status === 'Sắp hết hạn' ? 'volcano' : 'processing';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button type="primary" size="small">
                    Vào thi ngay
                </Button>
            ),
        },
    ];

    return (
        <Spin spinning={loading} tip="Đang tải dữ liệu học tập...">
            <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
                <h1 style={{ marginBottom: '8px' }}>Dashboard Học sinh</h1>
                <p style={{ marginBottom: '24px', color: '#666' }}>
                    Theo dõi tiến độ học tập và các bài thi sắp tới của bạn.
                </p>

                {/* ROW 1: THỐNG KÊ TỔNG QUAN (DATA THẬT) */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Tổng bài đã làm"
                                value={stats.totalExams}
                                prefix={<FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }}/>}
                                valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Điểm số trung bình"
                                value={stats.avgScore}
                                suffix="/ 10"
                                prefix={<FontAwesomeIcon icon={faStar} style={{ marginRight: '8px' }}/>}
                                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Tổng giờ ôn luyện"
                                value={stats.totalHours}
                                suffix="giờ"
                                prefix={<FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }}/>}
                                valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ROW 2: BIỂU ĐỒ TIẾN ĐỘ (DATA THẬT) */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col span={24}>
                        <Card
                            title="Tiến độ điểm số (15 bài gần nhất)"
                            bordered={false}
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        >
                            <div style={{ width: '100%', height: 300 }}>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer>
                                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                name="Điểm số"
                                                stroke="#1890ff"
                                                strokeWidth={3}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#999', paddingTop: '100px' }}>
                                        Chưa có dữ liệu bài thi để hiển thị biểu đồ
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>



            </div>
        </Spin>
    );
};

export default Dashboard;