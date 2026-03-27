import { Drawer, Tag, Typography, Divider, Card } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function ViewStudentDrawer({ student, onClose }) {
  return (
    <Drawer
      title="Chi tiết bài thi"
      open={!!student}
      onClose={onClose}
      style={{ width: 850 }}
    >
      {student && (
        <Card style={{ borderRadius: 10 }}>
          <Title level={5}>{student.exam?.title}</Title>

          <Divider />

          <Text>
            <b>Mã đề:</b> {student.exam?.code}
          </Text>
          <br />

          <Text>
            <b>Học sinh:</b>{" "}
            {student.student?.firstName} {student.student?.lastName}
          </Text>
          <br />

          <Text>
            <b>Thời gian bắt đầu:</b> {dayjs(student.startTime).format("DD/MM/YYYY HH:mm")}
          </Text>
          <br />

          <Text>
            <b>Thời gian kết thúc:</b> {dayjs(student.endTime).format("DD/MM/YYYY HH:mm")}
          </Text>
          <br />

          <Divider />

          <Text>
            <b>Điểm:</b>{" "}
            <Tag
              color={
                student.score >= 8
                  ? "green"
                  : student.score >= 6
                  ? "orange"
                  : "red"
              }
            >
              {student.score?.toFixed(1)}
            </Tag>
          </Text>
        </Card>
      )}
    </Drawer>
  );
}