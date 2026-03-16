import React from "react";
import { Row, Col, Card, Statistic } from "antd";

const QuestionStats = ({ stats }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 20 }}>
      <Col span={6}>
        <Card>
          <Statistic title="Total" value={stats.countTotal} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Easy" value={stats.countEasy} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Medium" value={stats.countMedium} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Hard" value={stats.countHard} />
        </Card>
      </Col>
    </Row>
  );
};

export default QuestionStats;
