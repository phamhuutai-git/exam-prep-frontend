import { Drawer, Tag, Typography, Divider, List, Card, Space } from "antd";

const { Title, Text } = Typography;

export default function ViewClassDrawer({ data, onClose }) {
  return (
    <Drawer title="Class Detail" open={!!data} onClose={onClose} size="large">
      {data && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Title level={5}>{data.name}</Title>

            <Space>
              <Tag color="blue">{data.students} students</Tag>
              <Tag color="purple">{data.exams.length} exams</Tag>
            </Space>
          </Card>

          {/* Exams */}
          <Divider>Danh sách đề thi</Divider>

          <List
            dataSource={data.exams}
            renderItem={(e) => (
              <Card size="small" style={{ marginBottom: 10 }}>
                <Space
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <div>
                    <Text strong>{e.title}</Text>
                    <br />
                    <Text type="secondary">{e.duration} phút</Text>
                  </div>

                  <Tag color={e.status === "HAS_EXAM" ? "green" : "red"}>
                    {e.status === "HAS_EXAM" ? " HAS_EXAM" : "NO_EXAM"}
                  </Tag>
                </Space>
              </Card>
            )}
          />
        </>
      )}
    </Drawer>
  );
}
