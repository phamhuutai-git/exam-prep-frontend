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
  setSubjectFilter,
  classes = [],
  teachers = [],
  subjects = []
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
            {classes.map(cls => (
              <Select.Option key={cls.id} value={cls.name}>
                {cls.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Giáo viên"
            value={teacherFilter}
            onChange={setTeacherFilter}
            allowClear
            style={{ width: 140 }}
          >
            {teachers.map(t => (
              <Select.Option key={t.id} value={t.username}>
                {t.teacherId} - {t.username}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Môn"
            value={subjectFilter}
            onChange={setSubjectFilter}
            allowClear
            style={{ width: 120 }}
          >
            {subjects.map(s => (
              <Select.Option key={s.id} value={s.name}>
                {s.name}
              </Select.Option>
            ))}
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

