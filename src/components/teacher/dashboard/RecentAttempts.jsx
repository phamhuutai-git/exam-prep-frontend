import { Table } from "antd";

export default function RecentAttempts({ data }) {
  const columns = [
    { title: "Học sinh", dataIndex: "student" },
    { title: "Đề thi", dataIndex: "exam" },
    { title: "Điểm", dataIndex: "score" },
  ];

  return (
    <div style={box}>
      <h3>Lượt thi gần đây</h3>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
}

const box = {
  flex: 1,
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  border: "1px solid #eee",
};
