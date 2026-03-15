import { useState } from "react";


const STATS = [
  {
    label: "Tổng đề thi",
    value: 5,
    sub: "+2 tháng này",
    color: "#E6F1FB",
    text: "#185FA5",
  },
  {
    label: "Tổng câu hỏi",
    value: 5,
    sub: "+1 tháng này",
    color: "#EAF3DE",
    text: "#3B6D11",
  },
  {
    label: "Lượt thi",
    value: 5,
    sub: "trong 30 ngày",
    color: "#FAEEDA",
    text: "#854F0B",
  },
  {
    label: "Điểm trung bình",
    value: "8.0",
    sub: "trên thang 10",
    color: "#FBEAF0",
    text: "#993556",
  },
];

const RECENT_EXAMS = [
  {
    code: "EX001",
    title: "Java Basic Test",
    category: "Java",
    attempts: 1,
    avgScore: 8.0,
    date: "2024-03-01",
  },
  {
    code: "EX003",
    title: "SQL Test",
    category: "SQL",
    attempts: 1,
    avgScore: 6.0,
    date: "2024-03-03",
  },
  {
    code: "EX005",
    title: "JS Test",
    category: "JavaScript",
    attempts: 1,
    avgScore: 10.0,
    date: "2024-03-05",
  },
];

const RECENT_ATTEMPTS = [
  {
    student: "Dung Pham",
    exam: "Java Basic Test",
    score: 8.0,
    date: "2024-04-01",
  },
  { student: "Dung Pham", exam: "SQL Test", score: 6.0, date: "2024-04-02" },
  { student: "Dung Pham", exam: "JS Test", score: 10.0, date: "2024-04-03" },
];

const SCORE_DIST = [
  { range: "0–4", count: 0 },
  { range: "4–5", count: 0 },
  { range: "5–6", count: 0 },
  { range: "6–7", count: 1 },
  { range: "7–8", count: 0 },
  { range: "8–9", count: 1 },
  { range: "9–10", count: 1 },
];

const CATEGORY_COLORS = {
  Java: { bg: "#EAF3DE", text: "#3B6D11" },
  Spring: { bg: "#E1F5EE", text: "#0F6E56" },
  SQL: { bg: "#E6F1FB", text: "#185FA5" },
  HTML: { bg: "#FAEEDA", text: "#854F0B" },
  JavaScript: { bg: "#FBEAF0", text: "#993556" },
};

const Badge = ({ label }) => {
  const c = CATEGORY_COLORS[label] || { bg: "#F1EFE8", text: "#5F5E5A" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 99,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
};

const ScoreChip = ({ score }) => {
  const color = score >= 8 ? "#3B6D11" : score >= 6 ? "#854F0B" : "#A32D2D";
  const bg = score >= 8 ? "#EAF3DE" : score >= 6 ? "#FAEEDA" : "#FCEBEB";
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 99,
        fontWeight: 500,
      }}
    >
      {score.toFixed(1)}
    </span>
  );
};

const maxCount = Math.max(...SCORE_DIST.map((d) => d.count), 1);

export default function TeacherDashboard() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  });

  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        background: "#fafaf8",
        minHeight: "100vh",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 4 }}>
              {greeting} 👋
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                margin: 0,
                color: "#1a1a18",
              }}
            >
              Binh Tran
            </h1>
            <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
              Giáo viên · Bộ môn Backend
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                border: "0.5px solid #ddd",
                borderRadius: 9,
                padding: "8px 16px",
                fontSize: 13,
                background: "#fff",
                cursor: "pointer",
                color: "#444",
              }}
              onClick={() => alert("Tạo câu hỏi")}
            >
              + Câu hỏi
            </button>
            <button
              style={{
                border: "none",
                borderRadius: 9,
                padding: "8px 16px",
                fontSize: 13,
                background: "#222",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => alert("Tạo đề thi")}
            >
              + Đề thi
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 12,
            marginBottom: "1.75rem",
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "0.5px solid #e8e8e5",
                borderRadius: 12,
                padding: "1.1rem 1.25rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: s.text,
                    opacity: 0.7,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#1a1a18",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: s.text,
                  marginTop: 6,
                  background: s.color,
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 99,
                }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Middle row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: "1.5rem",
          }}
        >
          {/* Score distribution */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid #e8e8e5",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 16,
                color: "#1a1a18",
              }}
            >
              Phân bố điểm
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 110,
              }}
            >
              {SCORE_DIST.map((d) => (
                <div
                  key={d.range}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#aaa",
                      fontWeight: 500,
                      minHeight: 14,
                    }}
                  >
                    {d.count || ""}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: d.count ? `${(d.count / maxCount) * 72}px` : 4,
                      background: d.count ? "#222" : "#f0f0ee",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                  <div style={{ fontSize: 10, color: "#bbb" }}>{d.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid #e8e8e5",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 14,
                color: "#1a1a18",
              }}
            >
              Truy cập nhanh
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  label: "Quản lý đề thi",
                  sub: "5 đề thi đang hoạt động",
                  color: "#E6F1FB",
                  tc: "#185FA5",
                },
                {
                  label: "Ngân hàng câu hỏi",
                  sub: "5 câu hỏi đã tạo",
                  color: "#EAF3DE",
                  tc: "#3B6D11",
                },
                {
                  label: "Kết quả thi",
                  sub: "5 lượt nộp bài",
                  color: "#FAEEDA",
                  tc: "#854F0B",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => alert(item.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: item.color,
                    border: "none",
                    borderRadius: 9,
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.tc,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 500, color: item.tc }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: item.tc,
                        opacity: 0.7,
                        marginTop: 1,
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: 14,
                      color: item.tc,
                      opacity: 0.5,
                    }}
                  >
                    ›
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {/* Recent exams */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid #e8e8e5",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18" }}>
                Đề thi của tôi
              </div>
              <button
                onClick={() => alert("Xem tất cả")}
                style={{
                  fontSize: 12,
                  color: "#888",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Xem tất cả ›
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {RECENT_EXAMS.map((exam, i) => (
                <div
                  key={exam.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom:
                      i < RECENT_EXAMS.length - 1
                        ? "0.5px solid #f5f5f3"
                        : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a1a18",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {exam.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <Badge label={exam.category} />
                      <span style={{ fontSize: 11, color: "#bbb" }}>
                        {exam.date}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{ fontSize: 11, color: "#aaa", marginBottom: 3 }}
                    >
                      {exam.attempts} lượt
                    </div>
                    <ScoreChip score={exam.avgScore} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent attempts */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid #e8e8e5",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18" }}>
                Lượt thi gần đây
              </div>
              <button
                onClick={() => alert("Xem tất cả")}
                style={{
                  fontSize: 12,
                  color: "#888",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Xem tất cả ›
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {RECENT_ATTEMPTS.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom:
                      i < RECENT_ATTEMPTS.length - 1
                        ? "0.5px solid #f5f5f3"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "#f0f0ee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#555",
                        flexShrink: 0,
                      }}
                    >
                      {a.student
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1a1a18",
                        }}
                      >
                        {a.student}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#aaa",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {a.exam}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      marginLeft: 10,
                      flexShrink: 0,
                    }}
                  >
                    <ScoreChip score={a.score} />
                    <div style={{ fontSize: 11, color: "#bbb", marginTop: 3 }}>
                      {a.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
