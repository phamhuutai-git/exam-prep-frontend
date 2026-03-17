export default function ScoreChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div style={box}>
      <h3>Phân bố điểm</h3>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}
      >
        {data.map((d) => (
          <div key={d.range} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 10 }}>{d.count}</div>
            <div
              style={{
                height: `${(d.count / max) * 80}px`,
                background: "#222",
                borderRadius: 4,
              }}
            />
            <div style={{ fontSize: 10 }}>{d.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const box = {
  flex: 1,
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  border: "1px solid #eee",
};
