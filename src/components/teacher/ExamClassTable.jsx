import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";

export default function ExamClassTable({ data, onView, onEdit, loading }) {
  const columns = [
    {
      title: "Lớp",
      dataIndex: "name",
    },
    {
      title: "Số học sinh",
      dataIndex: "studentCount",
    },
    {
      title: "Số đề thi",
      render: (_, record) => record.exams?.length || 0,
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={onView}
          onEdit={onEdit}
          showDelete={false}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
}
