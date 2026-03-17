import { Tag, Button } from "antd";
import BaseTable from "../common/BaseTable";

export default function ExamClassTable({ data, onAssign, loading }) {
  const columns = [
    {
      title: "Lớp",
      dataIndex: "name",
    },
    {
      title: "Số học sinh",
      dataIndex: "students",
    },
    {
      title: "Đề thi",
      dataIndex: "exam",
      render: (exam) => exam || "Chưa có",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      render: (d) => (d ? `${d} phút` : "—"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) =>
        s === "HAS_EXAM" ? (
          <Tag color="green">Đã gán</Tag>
        ) : (
          <Tag color="red">Chưa có</Tag>
        ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button type="primary" onClick={() => onAssign(record)}>
          {record.exam ? "Đổi đề" : "Gán đề"}
        </Button>
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
}
