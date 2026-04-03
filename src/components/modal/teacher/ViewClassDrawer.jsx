import { Drawer, Tag, Typography, Divider, List, Card, Space } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function ViewClassDrawer({ data, onClose }) {
  return (
    <Drawer
      title="Chi tiết lớp học"
      open={!!data}
      onClose={onClose}
      style={{ width: 500 }}
    >
      {data && (
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <Card style={{ marginBottom: 16 }}>
            <Title level={5}>{data.name}</Title>

            <Space>
              <Tag color="blue">{data.studentCount} học sinh</Tag>
              <Tag color="purple">{data.exams.length} đề thi</Tag>
            </Space>
          </Card>

          <Divider>Danh sách đề thi</Divider>

          <div>
            <List
              dataSource={data.exams}
              renderItem={(e) => (
                <Card
                  size="small"
                  style={{
                    marginBottom: 12,
                    borderRadius: 12,
                  }}
                >
                  <Space
                    orientation="vertical"
                    style={{ width: "100%" }}
                    size={4}
                  >
                    {/* Title */}
                    <Text strong style={{ fontSize: 15 }}>
                      {e.title}
                    </Text>

                    {/* Row info */}
                    <Space wrap size="small">
                      <Tag color="blue">Code: {e.code}</Tag>
                      <Tag color="green">Phân loại: {e.category?.name}</Tag>
                      <Tag>Thời gian: {e.duration}</Tag>
                    </Space>

                    {/* Date */}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(e.createDate).format("DD/MM/YYYY HH:mm")}
                    </Text>
                  </Space>
                </Card>
              )}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
