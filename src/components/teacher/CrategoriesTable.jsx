import React from "react";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";

const CategoryTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "id",
    },
    {
      title: "Danh mục",
      dataIndex: "name",
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={onEdit}
          showDelete={false}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default CategoryTable;
