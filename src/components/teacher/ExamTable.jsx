import React from 'react'
import { Table, Button, Tag, Switch, Space, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

const ExamTable = ({ data, loading, onEdit, onDelete }) => {


    // Columns definition
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            align: 'center',
            render: (index) => index + 1
        },
        {
            title: 'Code',
            dataIndex: 'code'
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title'
        },
        {
            title: 'Thời gian thi',
            dataIndex: 'duration'
        },
        {
            title: 'Tổng số câu hỏi',
            dataIndex: 'questions'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt'
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faFile} />}
                        onClick={() => onEdit(record)}
                        title="Xem chi tiết"
                    />
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPencil} />}
                        onClick={() => onEdit(record)}
                        title="Sửa"
                    />
                    <Popconfirm
                        title="Xóa đề thi?"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            danger
                            title="Xóa"
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            bordered
        />
    )
}
export default ExamTable
