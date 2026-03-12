import React from "react"
import { Row, Col, Input, Select, Space, Button } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons"
const UserFilter = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  classFilter,
  setClassFilter,
  subjectFilter,
  setSubjectFilter
}) => {
  const handleClear = () => {
    setSearchTerm("")
    setRoleFilter("")
    setClassFilter("")
    setSubjectFilter("")
  }
  return (
    <Row gutter={[12, 12]} align="middle" justify="space-between">
      {/* SEARCH */}
      <Col xs={24} sm={24} md={8}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm theo tên đăng nhập, email, họ tên..."
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
            style={{ width: 120 }}
          >
            <Select.Option value="admin">Quản trị viên</Select.Option>
            <Select.Option value="teacher">Giáo viên</Select.Option>
            <Select.Option value="student">Học sinh</Select.Option>
          </Select>

          <Select
            placeholder="Lớp"
            value={classFilter}
            onChange={setClassFilter}
            allowClear
            style={{ width: 120 }}
          >
            <Select.Option value="Lớp 10A1">Lớp 10A1</Select.Option>
            <Select.Option value="Lớp 10A2">Lớp 10A2</Select.Option>
            <Select.Option value="Lớp 11A1">Lớp 11A1</Select.Option>
          </Select>

          <Select
            placeholder="Môn"
            value={subjectFilter}
            onChange={setSubjectFilter}
            allowClear
            style={{ width: 120 }}
          >
            <Select.Option value="Toán">Toán</Select.Option>
            <Select.Option value="Văn">Văn</Select.Option>
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