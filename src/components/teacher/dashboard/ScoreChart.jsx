import { Card, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import dashBoardService from "../../../services/teacher/dashboardService";

export default function ScoreChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashBoardService
      .scoreDashboard()
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card
      title={<h3 style={{ margin: 0 }}>📊 Phân bố điểm</h3>}
      style={{
        flex: 2,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      {loading ? (
        <Spin />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            height: 180,
            padding: "10px 0",
          }}
        >
          {data.map((d) => (
            <div key={d.range} style={{ flex: 1, textAlign: "center" }}>
              <Tooltip title={`Số lượng: ${d.count}`}>
                <div
                  style={{
                    height: `${(d.count / max) * 120}px`,
                    background:
                      "linear-gradient(180deg, #4096ff 0%, #1677ff 100%)",
                    borderRadius: 8,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scaleY(1.1)";
                    e.currentTarget.style.filter = "brightness(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scaleY(1)";
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                />
              </Tooltip>

              <div style={{ fontSize: 12, marginTop: 6, color: "#555" }}>
                {d.range}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
