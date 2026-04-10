import React from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";
const QuestionTable = ({ data, loading, onView, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Câu hỏi",
      dataIndex: "content",
    },
    {
      title: "Mức độ",
      dataIndex: "difficulty",
      render: (d) => {
        const color =
          d === "EASY" ? "green" : d === "MEDIUM" ? "orange" : "red";
        return <Tag color={color}>{d}</Tag>;
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
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
