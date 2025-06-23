// employee-app/src/pages/EmployeeDashboard.js
import React from "react";

function EmployeeDashboard() {
  const employeeId = localStorage.getItem("employeeId");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Employee Dashboard</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        <p><strong>ID:</strong> {employeeId}</p>
        <p><strong>Position:</strong> Intern (example)</p>
        <p><strong>Joined:</strong> 2025-06-01</p>
        <p><strong>Status:</strong> Active</p>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
