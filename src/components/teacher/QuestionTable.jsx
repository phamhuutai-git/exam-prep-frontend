import React from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";
const QuestionTable = ({ data, loading, onView, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Question",
      dataIndex: "content",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      render: (d) => {
        const color =
          d === "EASY" ? "green" : d === "MEDIUM" ? "orange" : "red";
        return <Tag color={color}>{d}</Tag>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
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
          onView={(r) => onView(r.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default QuestionTable;
