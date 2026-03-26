import React from "react";
import { Modal, Tag, Row, Col, Card, Button } from "antd";
const View = ({ open, onClose, data }) => {
  if (!data) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1000}
      centered
      maskClosable={false}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      bodyStyle={{
        maxHeight: "75vh",
        overflowY: "auto",
        padding: 20,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>{data.title}</h2>
        <Tag color={data.status === "ĐẠT" ? "green" : "red"}>
          {data.status}
        </Tag>
      </div>

      {/* STATS */}
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ textAlign: "center", borderRadius: 12 }}>
            <p>Điểm</p>
            <h2>{data.score}/10</h2>
          </Card>
        </Col>

        <Col span={8}>
          <Card style={{ textAlign: "center", borderRadius: 12 }}>
            <p>Độ chính xác</p>
            <h3 style={{ color: "#52c41a", margin: 0 }}>
              {data.correct} Đúng
            </h3>
            <span style={{ color: "#f5222d" }}>
              {data.wrong} Sai
            </span>
          </Card>
        </Col>

        <Col span={8}>
          <Card style={{ textAlign: "center", borderRadius: 12 }}>
            <p>Thời gian</p>
            <h3>{data.timeDone}</h3>
          </Card>
        </Col>
      </Row>

      {/* QUESTIONS */}
      <div style={{ marginTop: 24 }}>
        {data.questions?.map((q, index) => (
          <div
            key={index}
            style={{
              marginBottom: 24,
              padding: 16,
              borderRadius: 12,
              background: "#fafafa",
              border: "1px solid #eee",
            }}
          >
            {/* QUESTION */}
            <h3>Câu {index + 1}</h3>
            <p style={{ marginBottom: 12 }}>{q.question}</p>

            {/* ANSWERS */}
            {q.answers.map((ans, i) => {
              const isSelected = q.selected === i;
              const isCorrect = ans.correct;

              let bg = "#fff";
              let border = "#ddd";
              let textColor = "#000";
              let label = "";

              if (q.selected !== undefined) {
                if (isSelected && isCorrect) {
                  // chọn đúng
                  bg = "#f6ffed";
                  border = "#b7eb8f";
                  textColor = "#389e0d";
                  label = " Đúng";
                } else if (isSelected && !isCorrect) {
                  // chọn sai
                  bg = "#fff1f0";
                  border = "#ffa39e";
                  textColor = "#cf1322";
                  label = " Sai";
                } else if (isCorrect) {
                  // đáp án đúng (khi user chọn sai)
                  bg = "#f6ffed";
                  border = "#b7eb8f";
                  textColor = "#389e0d";
                  label = " Đúng";
                }
              }

              return (
                <div
                  key={i}
                  style={{
                    marginBottom: 8,
                    padding: "10px 14px",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: bg,
                    border: `1px solid ${border}`,
                  }}
                >
                  <span
                    style={{
                      color: textColor,
                      fontWeight: 500,
                    }}
                  >
                    {ans.text}
                  </span>

                  {label && (
                    <span
                      style={{
                        color: textColor,
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default View;