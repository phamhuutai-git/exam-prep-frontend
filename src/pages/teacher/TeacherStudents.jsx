// export default function TeacherStudent() {
//   return <div>Student</div>;
// }
import { useState, useMemo } from "react";

const CLASSES = [
  { id: 1, name: "Railway01" },
  { id: 2, name: "Railway02" },
  { id: 3, name: "Railway03" },
  { id: 4, name: "Rocket01" },
  { id: 5, name: "Rocket02" },
];

const INITIAL_STUDENTS = [
  {
    id: 4,
    firstName: "Dung",
    lastName: "Pham",
    email: "student1@mail.com",
    username: "student1",
    classId: 1,
    status: "ACTIVED",
    isActive: true,
    createDate: "2024-01-04",
    attempts: [
      { exam: "Java Basic Test", score: 8.0, date: "2024-04-01" },
      { exam: "SQL Test", score: 6.0, date: "2024-04-02" },
      { exam: "JS Test", score: 10.0, date: "2024-04-03" },
    ],
  },
  {
    id: 5,
    firstName: "Huy",
    lastName: "Hoang",
    email: "student2@mail.com",
    username: "student2",
    classId: 2,
    status: "ACTIVED",
    isActive: true,
    createDate: "2024-01-05",
    attempts: [
      { exam: "Spring Test", score: 7.0, date: "2024-04-01" },
      { exam: "HTML Test", score: 9.0, date: "2024-04-02" },
    ],
  },
  {
    id: 6,
    firstName: "Linh",
    lastName: "Nguyen",
    email: "student3@mail.com",
    username: "student3",
    classId: 1,
    status: "LOCKED",
    isActive: false,
    createDate: "2024-01-06",
    attempts: [],
  },
  {
    id: 7,
    firstName: "Minh",
    lastName: "Tran",
    email: "student4@mail.com",
    username: "student4",
    classId: 3,
    status: "ACTIVED",
    isActive: true,
    createDate: "2024-01-07",
    attempts: [{ exam: "Java Basic Test", score: 5.0, date: "2024-04-05" }],
  },
  {
    id: 8,
    firstName: "Lan",
    lastName: "Le",
    email: "student5@mail.com",
    username: "student5",
    classId: 4,
    status: "ACTIVED",
    isActive: true,
    createDate: "2024-01-08",
    attempts: [
      { exam: "HTML Test", score: 9.5, date: "2024-04-06" },
      { exam: "JS Test", score: 8.5, date: "2024-04-07" },
    ],
  },
];

// Teacher only manages classes 1,2,4 (based on class_teacher seed)
const MY_CLASS_IDS = [1, 2, 4];

const getAvgScore = (attempts) => {
  if (!attempts.length) return null;
  return attempts.reduce((s, a) => s + a.score, 0) / attempts.length;
};

const getInitials = (first, last) => `${first[0]}${last[0]}`.toUpperCase();

const avatarColors = [
  { bg: "#E6F1FB", text: "#185FA5" },
  { bg: "#EAF3DE", text: "#3B6D11" },
  { bg: "#FAEEDA", text: "#854F0B" },
  { bg: "#FBEAF0", text: "#993556" },
  { bg: "#E1F5EE", text: "#0F6E56" },
];
const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

const StatusBadge = ({ status }) => (
  <span
    style={{
      fontSize: 11,
      padding: "3px 10px",
      borderRadius: 99,
      fontWeight: 500,
      background: status === "ACTIVED" ? "#EAF3DE" : "#FCEBEB",
      color: status === "ACTIVED" ? "#3B6D11" : "#A32D2D",
    }}
  >
    {status === "ACTIVED" ? "Hoạt động" : "Đã khóa"}
  </span>
);

const ScoreChip = ({ score }) => {
  if (score === null)
    return <span style={{ fontSize: 12, color: "#bbb" }}>—</span>;
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

// ─── Detail Drawer ─────────────────────────────────────────────────────────────
function StudentDetail({ student, onClose }) {
  const avg = getAvgScore(student.attempts);
  const ac = getAvatarColor(student.id);
  const className = CLASSES.find((c) => c.id === student.classId)?.name || "—";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 500,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          height: "100%",
          overflowY: "auto",
          borderLeft: "0.5px solid #e8e8e5",
          padding: "1.5rem",
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        <div style={{ animation: "slideIn 0.2s ease" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              Thông tin học sinh
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                color: "#aaa",
              }}
            >
              ✕
            </button>
          </div>

          {/* Avatar + name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: ac.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 600,
                color: ac.text,
                flexShrink: 0,
              }}
            >
              {getInitials(student.firstName, student.lastName)}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#1a1a18" }}>
                {student.firstName} {student.lastName}
              </div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
                @{student.username}
              </div>
              <div style={{ marginTop: 6 }}>
                <StatusBadge status={student.status} />
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div
            style={{
              background: "#fafaf8",
              borderRadius: 10,
              padding: "1rem",
              marginBottom: 16,
            }}
          >
            {[
              { label: "Email", value: student.email },
              { label: "Lớp", value: className },
              { label: "Ngày tham gia", value: student.createDate },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "0.5px solid #f0f0ee",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#999" }}>{row.label}</span>
                <span style={{ color: "#1a1a18", fontWeight: 500 }}>
                  {row.value}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 13,
              }}
            >
              <span style={{ color: "#999" }}>Điểm TB</span>
              <ScoreChip score={avg} />
            </div>
          </div>

          {/* Attempts */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#1a1a18",
              marginBottom: 10,
            }}
          >
            Lịch sử thi ({student.attempts.length} lượt)
          </div>
          {student.attempts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                color: "#bbb",
                fontSize: 13,
                background: "#fafaf8",
                borderRadius: 9,
              }}
            >
              Chưa thi lần nào
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {student.attempts.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fafaf8",
                    borderRadius: 9,
                    padding: "10px 14px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a1a18",
                      }}
                    >
                      {a.exam}
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>
                      {a.date}
                    </div>
                  </div>
                  <ScoreChip score={a.score} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TeacherStudent() {
  const [students] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tab, setTab] = useState("all");
  const [detail, setDetail] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  const myClasses = CLASSES.filter((c) => MY_CLASS_IDS.includes(c.id));

  const filtered = useMemo(() => {
    let data = students;
    if (tab === "mine")
      data = data.filter((s) => MY_CLASS_IDS.includes(s.classId));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.username.toLowerCase().includes(q),
      );
    }
    if (classFilter)
      data = data.filter((s) => s.classId === Number(classFilter));
    if (statusFilter) data = data.filter((s) => s.status === statusFilter);

    data = [...data].sort((a, b) => {
      if (sortBy === "name")
        return `${a.firstName}${a.lastName}`.localeCompare(
          `${b.firstName}${b.lastName}`,
        );
      if (sortBy === "score") {
        const sa = getAvgScore(a.attempts) ?? -1;
        const sb = getAvgScore(b.attempts) ?? -1;
        return sb - sa;
      }
      if (sortBy === "attempts") return b.attempts.length - a.attempts.length;
      return 0;
    });
    return data;
  }, [students, tab, search, classFilter, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const myStudents = students.filter((s) => MY_CLASS_IDS.includes(s.classId));
    const allScores = students.flatMap((s) => s.attempts.map((a) => a.score));
    const avg = allScores.length
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : 0;
    return {
      total: students.length,
      myClass: myStudents.length,
      active: students.filter((s) => s.status === "ACTIVED").length,
      avg: avg.toFixed(1),
    };
  }, [students]);

  const selectStyle = {
    border: "0.5px solid #ddd",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    background: "#fff",
    color: "#555",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        background: "#fafaf8",
        minHeight: "100vh",
        padding: "2rem 1.5rem",
      }}
    >
      {detail && (
        <StudentDetail student={detail} onClose={() => setDetail(null)} />
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                margin: 0,
                color: "#1a1a18",
              }}
            >
              Quản lý học sinh
            </h1>
            <div style={{ fontSize: 13, color: "#999", marginTop: 3 }}>
              Theo dõi học sinh và kết quả học tập
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 12,
            marginBottom: "1.75rem",
          }}
        >
          {[
            {
              label: "Tổng học sinh",
              value: stats.total,
              bg: "#f7f7f5",
              color: "#1a1a18",
            },
            {
              label: "Lớp tôi dạy",
              value: stats.myClass,
              bg: "#E6F1FB",
              color: "#185FA5",
            },
            {
              label: "Đang hoạt động",
              value: stats.active,
              bg: "#EAF3DE",
              color: "#3B6D11",
            },
            {
              label: "Điểm TB",
              value: stats.avg,
              bg: "#FAEEDA",
              color: "#854F0B",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: 12,
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: s.color,
                  opacity: 0.7,
                  marginTop: 5,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "0.5px solid #e8e8e5",
            marginBottom: "1.25rem",
          }}
        >
          {[
            ["all", "Tất cả học sinh"],
            ["mine", "Lớp tôi dạy"],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  tab === t ? "2px solid #222" : "2px solid transparent",
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: tab === t ? 500 : 400,
                color: tab === t ? "#222" : "#888",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, username..."
            style={{
              width: 260,
              border: "0.5px solid #ddd",
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: 13,
              outline: "none",
              background: "#fff",
              color: "#222",
            }}
          />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">Tất cả lớp</option>
            {CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVED">Hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="name">Sắp xếp: Tên</option>
            <option value="score">Sắp xếp: Điểm TB</option>
            <option value="attempts">Sắp xếp: Lượt thi</option>
          </select>
          {(search || classFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setClassFilter("");
                setStatusFilter("");
              }}
              style={{
                border: "0.5px solid #ddd",
                borderRadius: 8,
                padding: "7px 12px",
                fontSize: 12,
                background: "transparent",
                cursor: "pointer",
                color: "#888",
              }}
            >
              Xóa bộ lọc ✕
            </button>
          )}
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e8e8e5",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f7f7f5",
                  borderBottom: "0.5px solid #e8e8e5",
                }}
              >
                {[
                  { label: "Học sinh", w: "30%" },
                  { label: "Lớp", w: "12%" },
                  { label: "Email", w: "22%" },
                  { label: "Lượt thi", w: "10%" },
                  { label: "Điểm TB", w: "10%" },
                  { label: "Trạng thái", w: "10%" },
                  { label: "Ngày tạo", w: "10%" },
                ].map((h) => (
                  <th
                    key={h.label}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontWeight: 500,
                      color: "#888",
                      fontSize: 12,
                      width: h.w,
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2.5rem",
                      color: "#bbb",
                      fontSize: 13,
                    }}
                  >
                    Không có học sinh nào
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const avg = getAvgScore(s.attempts);
                  const ac = getAvatarColor(s.id);
                  const className =
                    CLASSES.find((c) => c.id === s.classId)?.name || "—";
                  const isMine = MY_CLASS_IDS.includes(s.classId);
                  return (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: "0.5px solid #f5f5f3",
                        cursor: "pointer",
                      }}
                      onClick={() => setDetail(s)}
                      onMouseEnter={(e) =>
                        e.currentTarget
                          .querySelectorAll("td")
                          .forEach((td) => (td.style.background = "#fafaf8"))
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget
                          .querySelectorAll("td")
                          .forEach((td) => (td.style.background = ""))
                      }
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: ac.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 600,
                              color: ac.text,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(s.firstName, s.lastName)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 500,
                                color: "#1a1a18",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {s.firstName} {s.lastName}
                              {isMine && (
                                <span
                                  style={{
                                    marginLeft: 6,
                                    fontSize: 10,
                                    background: "#E6F1FB",
                                    color: "#185FA5",
                                    padding: "2px 7px",
                                    borderRadius: 99,
                                    fontWeight: 500,
                                  }}
                                >
                                  Lớp tôi
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 11, color: "#bbb" }}>
                              @{s.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", color: "#555" }}>
                        {className}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          color: "#888",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.email}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          textAlign: "center",
                          color: "#555",
                        }}
                      >
                        {s.attempts.length}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <ScoreChip score={avg} />
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <StatusBadge status={s.status} />
                      </td>
                      <td style={{ padding: "11px 14px", color: "#bbb" }}>
                        {s.createDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "#bbb" }}>
          Hiển thị {filtered.length} / {students.length} học sinh
        </div>

        {/* Class summary */}
        <div style={{ marginTop: "1.75rem" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#1a1a18",
              marginBottom: 12,
            }}
          >
            Tóm tắt theo lớp
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: 10,
            }}
          >
            {myClasses.map((cls) => {
              const clsStudents = students.filter((s) => s.classId === cls.id);
              const clsScores = clsStudents.flatMap((s) =>
                s.attempts.map((a) => a.score),
              );
              const clsAvg = clsScores.length
                ? (
                    clsScores.reduce((a, b) => a + b, 0) / clsScores.length
                  ).toFixed(1)
                : "—";
              return (
                <div
                  key={cls.id}
                  style={{
                    background: "#fff",
                    border: "0.5px solid #e8e8e5",
                    borderRadius: 10,
                    padding: "1rem 1.25rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#1a1a18",
                      marginBottom: 10,
                    }}
                  >
                    {cls.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#999" }}>Học sinh</span>
                    <span style={{ fontWeight: 500 }}>
                      {clsStudents.length}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginTop: 5,
                    }}
                  >
                    <span style={{ color: "#999" }}>Lượt thi</span>
                    <span style={{ fontWeight: 500 }}>
                      {clsStudents.reduce((s, st) => s + st.attempts.length, 0)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginTop: 5,
                    }}
                  >
                    <span style={{ color: "#999" }}>Điểm TB</span>
                    <span style={{ fontWeight: 500 }}>{clsAvg}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
