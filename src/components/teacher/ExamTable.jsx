import React from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";
const ExamTable = ({ data, loading, onPreview, onEdit }) => {
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (d) => <Tag color="blue">{d} phút</Tag>,
    },
    {
      title: "Questions",
      dataIndex: "questions",
    },
    {
      title: "Created",
      dataIndex: "createDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={onPreview}
          onEdit={onEdit}
          onDelete={false}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default ExamTable;
