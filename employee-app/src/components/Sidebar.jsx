// employee-app/src/components/Sidebar.jsx
import React from 'react'
import './Sidebar.css'

export default function Sidebar({ employeeName }) {
  return (
    <aside className="sidebar">
      <div className="profile-section">
        <h2>{employeeName}</h2>
        <p>Position: Employee</p>
        <p>Joined: 2024-01-01</p>
      </div>
      <nav>
        <a href="/employee/dashboard">Files</a>
        <a href="/employee/activity">Activity</a>
      </nav>
    </aside>
  )
}
