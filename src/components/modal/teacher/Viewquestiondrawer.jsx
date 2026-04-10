import { Drawer, Tag, Typography, Divider, List, Card, Space } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const diffColor = {
  EASY: "green",
  MEDIUM: "orange",
  HARD: "red",
};

export default function ViewQuestionDrawer({ question, onClose }) {
  return (
    <Drawer
      title="Chi tiết câu hỏi"
      open={!!question}
      onClose={onClose}
       size="large"
    >
      {question && (
        <>
          {/* Question Content */}
          <Card
            style={{
              marginBottom: 16,
              borderRadius: 10,
              background: "#fafafa",
            }}
          >
            <Title level={5} style={{ marginBottom: 12 }}>
              {question.content}
            </Title>

            <Space wrap>
              <Tag color={diffColor[question?.difficulty]}>
                {question?.difficulty}
              </Tag>

              <Tag color="blue">{question?.category}</Tag>
            </Space>

            <Divider style={{ margin: "12px 0" }} />

            <Space direction="vertical" size={2}>
              <Text type="secondary">
                <UserOutlined /> Created by: {question?.creator}
              </Text>

              <Text type="secondary">
                <CalendarOutlined /> Created date: {question?.createdDate}
              </Text>
            </Space>
          </Card>

          {/* Answers */}
          {question.answers && question.answers.length > 0 && (
            <>
              <Divider orientation="left">Đáp án</Divider>

              <List
                rowKey={(item, index) => index}
                dataSource={question.answers}
                renderItem={(ans, idx) => (
                  <Card
                    size="small"
                    style={{
                      marginBottom: 10,
                      borderRadius: 8,
                      border: ans.isCorrect
                        ? "2px solid #52c41a"
                        : "1px solid #f0f0f0",
                      background: ans.isCorrect ? "#f6ffed" : "#fff",
                    }}
                  >
                    <Space>
                      <Text strong={ans.isCorrect}>
                        {idx + 1}. {ans.content}
                      </Text>

                      {ans.isCorrect && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          Correct
                        </Tag>
                      )}
                    </Space>
                  </Card>
                )}
              />
            </>
          )}
          {/* Explanation */}
          {question?.explanation && (
            <>
              <Divider orientation="left">Giải thích</Divider>

              <Card
                style={{
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: 10,
                }}
              >
                <Space align="start">
                  <BulbOutlined style={{ color: "#faad14", fontSize: 18 }} />
                  <Text>{question.explanation}</Text>
                </Space>
              </Card>
            </>
          )}
        </>
      )}
    </Drawer>
  );
}
