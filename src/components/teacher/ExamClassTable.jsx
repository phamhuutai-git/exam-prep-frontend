import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";

export default function ExamClassTable({ data, onView, onEdit, loading }) {
  const columns = [
    {
      title: "Class",
      dataIndex: "name",
    },
    {
      title: "Students",
      dataIndex: "students",
    },
    {
      title: "Total Exams",
      render: (_, record) => record.exams?.length || 0,
    },
    {
      title: "Action",
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
