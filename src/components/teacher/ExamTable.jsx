import React from 'react'
import { Table, Button, Tag, Switch, Space, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'

const ExamTable = ({ data, loading, onPreview, onEdit, onDelete }) => {


    // Columns definition
    const columns = [
        {
            title: 'Mã đề thi',
            dataIndex: 'code',
            align: 'center'
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            onHeaderCell: () => ({
                style: { textAlign: 'center' }
            })
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            align: 'center'
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            align: 'center'
        },
        {
            title: 'Số câu hỏi',
            dataIndex: 'questions',
            align: 'center'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            align: 'center',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faFile} style={{ color: "#1677ff" }} />}
                        onClick={() => onPreview(record)}
                        title="Xem chi tiết"
                    />
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPencil} style={{ color: "#fa8f14" }} />}
                        onClick={() => onEdit(record)}
                        title="Sửa"
                    />
                    <Popconfirm
                        title="Xóa đề thi?"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faTrash} style={{ color: "#ff4d4f" }} />}
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
