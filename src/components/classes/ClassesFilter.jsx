import React from "react"
import { Row, Col, Input, Space, Button } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons"

const ClassesFilter = ({
  searchTerm,
  setSearchTerm
}) => {
  const handleClear = () => {
    setSearchTerm("")
  }

  return (
    <Row gutter={[12, 12]} align="middle" justify="space-between">
      {/* SEARCH */}
      <Col xs={24} sm={24} md={8}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm theo tên lớp"
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

export default ClassesFilter

