import React from "react"

const AssignTeacherHeader = ({ title, description }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24
      }}
    >
      <div>
        <h1 style={{ marginBottom: 4 }}>
          {title}
        </h1>
        <p style={{ margin: 0, color: "#666" }}>
          {description}
        </p>
      </div>
    </div>
  )
}

export default AssignTeacherHeader