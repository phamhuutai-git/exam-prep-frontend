import React from "react"
import { Row, Col, Input, Select, Space, Button } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons"

const AssignTeacherFilter = ({
  searchTerm,
  setSearchTerm,
  classFilter,
  setClassFilter,
  teacherFilter,
  setTeacherFilter,
  subjectFilter,
  setSubjectFilter
}) => {
  const handleClear = () => {
    setSearchTerm("")
    setClassFilter("")
    setTeacherFilter("")
    setSubjectFilter("")
  }

  return (
    <Row gutter={[12, 12]} align="middle" justify="space-between">
      {/* SEARCH */}
      <Col xs={24} sm={24} md={8}>
        <Input
          className="search-input"
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm lớp, giáo viên, môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </Col>
      {/* FILTER */}
      <Col>
        <Space>
          <Select
            placeholder="Lớp"
            value={classFilter}
            onChange={setClassFilter}
            allowClear
            style={{ width: 120 }}
          >
            <Select.Option value="10A1">10A1</Select.Option>
            <Select.Option value="10A2">10A2</Select.Option>
            <Select.Option value="11B1">11B1</Select.Option>
          </Select>
          <Select
            placeholder="Giáo viên"
            value={teacherFilter}
            onChange={setTeacherFilter}
            allowClear
            style={{ width: 140 }}
          >
            <Select.Option value="teacher1">teacher1 (GV01)</Select.Option>
            <Select.Option value="teacher2">teacher2 (GV02)</Select.Option>
            <Select.Option value="teacher3">teacher3 (GV03)</Select.Option>
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
            <Select.Option value="Anh">Anh</Select.Option>
          </Select>
          <Button onClick={handleClear}>
            <FontAwesomeIcon icon={faArrowRotateLeft} /> Xóa bộ lọc
          </Button>
        </Space>
      </Col>
    </Row>
  )
}

export default AssignTeacherFilter

