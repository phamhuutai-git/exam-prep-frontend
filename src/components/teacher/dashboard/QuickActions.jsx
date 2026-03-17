import { Card, Button, Space } from "antd";
import {
  FileTextOutlined,
  FormOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card
      title="Truy cập nhanh"
      style={{
        flex: 1,
        borderRadius: 10,
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          icon={<FileTextOutlined />}
          block
          onClick={() => navigate("/teacher/exams")}
        >
          Quản lý đề thi
        </Button>

        <Button
          icon={<FormOutlined />}
          block
          onClick={() => navigate("/teacher/questions")}
        >
          Ngân hàng câu hỏi
        </Button>

        <Button
          icon={<BarChartOutlined />}
          block
          onClick={() => navigate("/teacher/students")}
        >
          Kết quả thi
        </Button>
      </Space>
    </Card>
  );
}
