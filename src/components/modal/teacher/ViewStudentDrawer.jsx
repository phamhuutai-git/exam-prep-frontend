import { Drawer, Tag, Typography, Divider, List, Card, Space } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const getAvgScore = (attempts) => {
  if (!attempts.length) return null;
  return attempts.reduce((s, a) => s + a.score, 0) / attempts.length;
};

const getStatusTag = (status) => {
  return status === "ACTIVED" ? (
    <Tag color="green">Actived</Tag>
  ) : (
    <Tag color="red">Lock</Tag>
  );
};

const getScoreTag = (score) => {
  if (score === null) return <Tag>—</Tag>;
  if (score >= 8) return <Tag color="green">{score.toFixed(1)}</Tag>;
  if (score >= 6) return <Tag color="orange">{score.toFixed(1)}</Tag>;
  return <Tag color="red">{score.toFixed(1)}</Tag>;
};

export default function ViewStudentDrawer({ student, onClose }) {
  const avg = student ? getAvgScore(student.attempts) : null;

  return (
    <Drawer
      title="Student Detail"
      open={!!student}
      onClose={onClose}
      size="large"
    >
      {student && (
        <>
          <Card
            style={{
              marginBottom: 16,
              borderRadius: 10,
              background: "#fafafa",
            }}
          >
            <Title level={5}>
              {student.firstName} {student.lastName}
            </Title>

            <Space wrap>
              {getStatusTag(student.status)}
              <Tag color="blue">@{student.username}</Tag>
            </Space>

            <Divider style={{ margin: "12px 0" }} />

            <Space direction="vertical" size={4}>
              <Text type="secondary">
                <UserOutlined /> Email: {student.email}
              </Text>

              <Text type="secondary">
                <CalendarOutlined /> Created: {student.createDate}
              </Text>

              <Text type="secondary">
                <BookOutlined /> Avg Score: {getScoreTag(avg)}
              </Text>
            </Space>
          </Card>

          {/* Attempts */}
          <Divider orientation="left">
            Lịch sử thi ({student.attempts.length})
          </Divider>

          {student.attempts.length === 0 ? (
            <Text type="secondary">Chưa thi lần nào</Text>
          ) : (
            <List
              dataSource={student.attempts}
              rowKey={(item, index) => index}
              renderItem={(a) => (
                <Card
                  size="small"
                  style={{
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                >
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div>
                      <Text strong>{a.exam}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {a.date}
                      </Text>
                    </div>

                    {getScoreTag(a.score)}
                  </Space>
                </Card>
              )}
            />
          )}
        </>
      )}
    </Drawer>
  );
}
