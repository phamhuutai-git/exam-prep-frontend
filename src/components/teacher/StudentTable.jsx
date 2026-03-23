import React from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";
const StudentTable = ({ data, loading, onView }) => {
  const columns = [
    {
      title: "Student",
      dataIndex: "student",
    },
    {
      title: "Class",
      dataIndex: "class",
    },

    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Attempt",
      dataIndex: "attempt",
    },
    {
      title: "Avg",
      dataIndex: "avg",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const color = status === "ACTIVED" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
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
