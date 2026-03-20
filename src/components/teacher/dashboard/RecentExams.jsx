import { Table } from "antd";

export default function RecentExams({ data }) {
  const columns = [
    { title: "Tên đề", dataIndex: "title" },
    { title: "Môn", dataIndex: "category" },
    { title: "Lượt thi", dataIndex: "attempts" },
    { title: "Điểm TB", dataIndex: "avgScore" },
  ];

  return (
    <div style={box}>
      <h3>Đề thi của tôi</h3>
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
