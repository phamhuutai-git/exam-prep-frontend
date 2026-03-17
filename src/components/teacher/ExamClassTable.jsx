import { Tag, Button } from "antd";
import BaseTable from "../common/BaseTable";

export default function ExamClassTable({ data, onAssign, loading }) {
  const columns = [
    {
      title: "Class",
      dataIndex: "name",
    },
    {
      title: "Students Number",
      dataIndex: "students",
    },
    {
      title: "Exam",
      dataIndex: "exam",
      render: (exam) => exam || "Chưa có",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (d) => (d ? `${d} phút` : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) =>
        s === "HAS_EXAM" ? (
          <Tag color="green">HAS_EXAM</Tag>
        ) : (
          <Tag color="red">NO_EXAM</Tag>
        ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="primary" onClick={() => onAssign(record)}>
          {record.exam ? "Đổi đề" : "Gán đề"}
        </Button>
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
}
