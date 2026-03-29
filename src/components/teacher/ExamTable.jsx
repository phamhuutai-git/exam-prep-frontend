import React from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";
const ExamTable = ({ data, loading, onPreview, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Mã đề thi",
      dataIndex: "code",
    },
    {
      title: "Tên đề thi",
      dataIndex: "title",
    },
    {
      title: "Loại đề thi",
      dataIndex: "examType",
      render: (type) => {
        let color = "default";
        let text = "";
        switch (type) {
          case "PRACTICE":
            color = "success";
            text = "Luyện tập";
            break;
          case "OFFICIAL":
            color = "error";
            text = "Thi thật";
            break;
          default:
            color = "default";
            text = type;
        }
        return <Tag color={color}>{text}</Tag>;
      },

    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      render: (d) => <Tag color="blue">{d} phút</Tag>,
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questions",
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
          onView={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default ExamTable;
