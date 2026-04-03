import { Card } from "antd";
import {
  FileTextOutlined,
  FormOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Quản lý đề thi",
      icon: <FileTextOutlined />,
      color: "#1677ff",
      path: "/teacher/exams",
    },
    {
      label: "Ngân hàng câu hỏi",
      icon: <FormOutlined />,
      color: "#52c41a",
      path: "/teacher/questions",
    },
    {
      label: "Xem điểm học viên",
      icon: <TeamOutlined />,
      color: "#fa8c16",
      path: "/teacher/students",
    },
  ];

  return (
    <Card
      title={<h3 style={{ margin: 0 }}>⚡ Truy cập nhanh</h3>}
      style={{
        flex: 1,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              borderRadius: 12,
              cursor: "pointer",
              background: "#fafafa",
              transition: "all 0.25s ease",
              border: "1px solid #f0f0f0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                fontSize: 20,
                color: "#fff",
                background: action.color,
                padding: 10,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {action.icon}
            </div>

            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {action.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
