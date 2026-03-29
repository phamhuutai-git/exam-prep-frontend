import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";
const StudentTable = ({ data, loading, onView }) => {
  const columns = [
    {
      title: "Mã đề thi",
      dataIndex: "code",
    },
    {
      title: "Đề thi",
      dataIndex: "exam",
    },
    {
      title: "Học sinh",
      dataIndex: "student",
    },

    {
      title: "Lớp",
      dataIndex: "class",
    },
    {
      title: "Điểm thi",
      dataIndex: "score",
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={(r) => onView(r)}
          showEdit={false}
          showDelete={false}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default StudentTable;
