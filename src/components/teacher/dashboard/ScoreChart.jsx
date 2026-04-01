import { Card, Spin } from "antd";
import { useEffect, useState } from "react";
import dashBoardService from "../../../services/teacher/dashboardService";
export default function ScoreChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashBoardService
      .scoreDashboard()
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card
      title={<h3 style={{ margin: 0 }}>Phân bố điểm</h3>}
      style={{
        flex: 1,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {loading ? (
        <Spin />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            height: 140,
          }}
        >
          {data.map((d) => (
            <div key={d.range} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>{d.count}</div>

              <div
                style={{
                  height: `${(d.count / max) * 90}px`,
                  background: "#1677ff",
                  borderRadius: 6,
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scaleY(1.15)";
                  e.currentTarget.style.background = "#4096ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scaleY(1)";
                  e.currentTarget.style.background = "#1677ff";
                }}
              />

              <div style={{ fontSize: 12, marginTop: 4 }}>{d.range}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
