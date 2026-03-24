import React from "react"
import { Row, Col, Input, Select, Space, Button } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons"

const UserFilter = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter
}) => {

  const handleClear = () => {
    setSearchTerm("")
    setRoleFilter("")
  }

  return (
    <Row gutter={[12, 12]} align="middle" justify="space-between">

      {/* SEARCH */}
      <Col xs={24} sm={24} md={8}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm theo username, họ tên hoặc email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </Col>

      {/* FILTER */}
      <Col>
        <Space>
          <Select
            placeholder="Vai trò"
            value={roleFilter}
            onChange={setRoleFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="admin">Quản trị viên</Select.Option>
            <Select.Option value="teacher">Giáo viên</Select.Option>
            <Select.Option value="student">Học sinh</Select.Option>
          </Select>

          <Button onClick={handleClear}>
            <FontAwesomeIcon icon={faArrowRotateLeft} /> Xóa bộ lọc
          </Button>
        </Space>
      </Col>

    </Row>
  )
}

export default UserFilter