import { Modal, Checkbox, Space, Tag, Divider, Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState, useMemo } from "react";

export default function EditClassExamModal({
  open,
  data,
  exams,
  onCancel,
  onSave,
}) {
  const ITEM_HEIGHT = 100;

  // ===== STATE =====
  const [selectedExamIds, setSelectedExamIds] = useState([]);
  const [pending, setPending] = useState([]);

  // ===== HELPER =====
  const getId = (e) => e.examId ?? e.id;

  // ===== INIT =====
  useEffect(() => {
    if (data) {
      const ids = data.exams?.map(getId) || [];
      setSelectedExamIds(ids);
      setPending([]);
    }
  }, [data]);

  const originalIds = data?.exams?.map(getId) || [];

  // ===== MEMO: SPLIT DATA =====
  const assignedExams = useMemo(
    () => exams.filter((e) => originalIds.includes(getId(e))),
    [exams, originalIds]
  );

  const availableExams = useMemo(
    () => exams.filter((e) => !originalIds.includes(getId(e))),
    [exams, originalIds]
  );

  // ===== HANDLE CHECK =====
  const handleCheck = (item, checked) => {
    const id = getId(item);
    const isOriginal = originalIds.includes(id);

    // update pending
    setPending((prev) => {
      const filtered = prev.filter((p) => getId(p) !== id);
      if (checked !== isOriginal) {
        filtered.push({ ...item, action: checked ? "ADD" : "REMOVE" });
      }
      return filtered;
    });

    // update selected
    setSelectedExamIds((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((i) => i !== id)
    );
  };

  // ===== REMOVE PENDING =====
  const removePending = (item) => {
    const id = getId(item);
    const isOriginal = originalIds.includes(id);

    setPending((prev) => prev.filter((p) => getId(p) !== id));
    setSelectedExamIds((prev) =>
      isOriginal ? [...new Set([...prev, id])] : prev.filter((i) => i !== id)
    );
  };

  // ===== CARD STYLE =====
  const cardStyle = (item) => {
    const id = getId(item);
    const isOriginal = originalIds.includes(id);
    const pendingItem = pending.find((p) => getId(p) === id);

    let bg = "#fafafa"; // default
    if (isOriginal) bg = "#f6ffed";
    if (pendingItem?.action === "ADD") bg = "#e6f7ff";
    if (pendingItem?.action === "REMOVE") bg = "#fff1f0";

    return {
      height: ITEM_HEIGHT,
      borderRadius: 10,
      padding: 12,
      background: bg,
      transition: "0.2s",
      position: "relative",
    };
  };

  // ===== GRID STYLE =====
  const grid2Rows = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    maxHeight: ITEM_HEIGHT * 2 + 12,
    overflowY: "auto",
  };

  const grid1Row = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    maxHeight: ITEM_HEIGHT,
    overflowY: "auto",
  };

  // ===== RENDER ITEM =====
  const renderItem = (item) => {
    const id = getId(item);
    const checked = selectedExamIds.includes(id);
    const pendingItem = pending.find((p) => getId(p) === id);

    return (
      <div key={id} style={cardStyle(item)}>
        <Space align="start">
          <Checkbox
            checked={checked}
            onChange={(e) => handleCheck(item, e.target.checked)}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{item.title}</div>

            <Space wrap size={4} style={{ marginTop: 4 }}>
              <Tag color="blue">{item.code}</Tag>
              <Tag color="green">{item.category?.name}</Tag>
            </Space>

            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              {item.duration}
            </div>

            <div style={{ fontSize: 12, color: "#aaa" }}>
              {dayjs(item.createDate).format("DD/MM")}
            </div>

            {pendingItem && (
              <Tag
                color={pendingItem.action === "ADD" ? "blue" : "red"}
                style={{ position: "absolute", top: 6, right: 6 }}
              >
                {pendingItem.action === "ADD" ? "Thêm" : "Xóa"}
              </Tag>
            )}
          </div>
        </Space>
      </div>
    );
  };

  // ===== SAVE =====
  const handleSave = () => {
    onSave({
      classId: data.id,
      examIds: selectedExamIds,
    });
  };

  return (
    <Modal
      title={`Cập nhật đề thi cho lớp: ${data?.name || ""}`}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      {/* Assigned */}
      <h3>Đề thi đã gán</h3>
      <div style={grid2Rows}>{assignedExams.map(renderItem)}</div>

      <Divider />

      {/* Pending */}
      <h3>Đang chờ thay đổi</h3>
      <div style={grid1Row}>
        {pending.map((item) => (
          <div
            key={getId(item)}
            style={{
              height: ITEM_HEIGHT,
              background: item.action === "ADD" ? "#e6f7ff" : "#fff1f0",
              borderRadius: 10,
              padding: 12,
              position: "relative",
            }}
          >
            <Button
              size="small"
              danger
              style={{ position: "absolute", top: 6, right: 6 }}
              onClick={() => removePending(item)}
            >
              -
            </Button>

            <Tag color={item.action === "ADD" ? "blue" : "red"}>
              {item.action === "ADD" ? "Xác nhận thêm" : "Xác nhận xóa"}
            </Tag>

            <div style={{ marginTop: 6, fontWeight: 500 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{item.code}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Available */}
      <h3>Đề thi có sẵn</h3>
      <div style={grid2Rows}>{availableExams.map(renderItem)}</div>
    </Modal>
  );
}