// import { Card, Button, Space } from "antd";
// import {
//   FileTextOutlined,
//   FormOutlined,
//   BarChartOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// export default function QuickActions() {
//   const navigate = useNavigate();

//   return (
//     <Card
//       title="Truy cập nhanh"
//       style={{
//         flex: 1,
//         borderRadius: 10,
//       }}
//     >
//       <Space direction="vertical" style={{ width: "100%" }}>
//         <Button
//           icon={<FileTextOutlined />}
//           block
//           onClick={() => navigate("/teacher/exams")}
//         >
//           Quản lý đề thi
//         </Button>

//         <Button
//           icon={<FormOutlined />}
//           block
//           onClick={() => navigate("/teacher/questions")}
//         >
//           Ngân hàng câu hỏi
//         </Button>

//         <Button
//           icon={<BarChartOutlined />}
//           block
//           onClick={() => navigate("/teacher/students")}
//         >
//           Quản lý học sinh
//         </Button>
//       </Space>
//     </Card>
//   );
// }
import { Card, Button, Space } from "antd";
import {
  FileTextOutlined,
  FormOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Quản lý đề thi",
      icon: <FileTextOutlined />,
      path: "/teacher/exams",
    },
    {
      label: "Ngân hàng câu hỏi",
      icon: <FormOutlined />,
      path: "/teacher/questions",
    },
    {
      label: "Kết quả thi",
      icon: <BarChartOutlined />,
      path: "/teacher/students",
    },
  ];

  return (
    <Card
      title=" Truy cập nhanh"
      style={{
        flex: 1,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {actions.map((action, index) => (
          <Button
            key={index}
            type={action.type}
            icon={action.icon}
            block
            size="large"
            onClick={() => navigate(action.path)}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 10,
              borderRadius: 10,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {action.label}
          </Button>
        ))}
      </Space>
    </Card>
  );
}
