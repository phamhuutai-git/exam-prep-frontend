import React from 'react'
import { Row, Col, Input, Button, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
const AssignTeacherFilter = ({
  searchTerm,
  setSearchTerm,
  handleClear
}) => {
  return (
    
<Row gutter={[12, 12]} align="middle" justify="space-between">
      {/* SEARCH */}
      <Col xs={24} sm={24} md={8}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm Theo Lớp"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </Col>
      <Col>
        <Space>
          <Button onClick={handleClear}>
            <FontAwesomeIcon icon={faArrowRotateLeft} /> Xóa bộ lọc
          </Button>
        </Space>
      </Col>
    </Row>
  )
}

export default AssignTeacherFilter