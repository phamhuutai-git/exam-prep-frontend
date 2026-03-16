import React from "react";
import { Table, Button, Tag, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
      dataIndex: "createdDate",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => onView(record.id)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      bordered
    />
  );
};

export default QuestionTable;
