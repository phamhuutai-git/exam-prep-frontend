import React from "react";
import { Row, Col, Card, Statistic } from "antd";

const StatsCards = ({ items }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 20 }}>
      {items.map((item, index) => (
        <Col span={6} key={index}>
          <Card>
            <Statistic
              title={item.title}
              value={item.value}
              suffix={item.suffix}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
