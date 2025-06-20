import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

useEffect(() => {
  const fetchLogs = () => {
    fetch('http://localhost:5000/api/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.logs);
          setLastUpdated(new Date().toLocaleString());
        }
      });
  };

  fetchLogs();
  const interval = setInterval(fetchLogs, 5000);

  return () => clearInterval(interval);
}, []);



  return (
    <div className="dashboard-container">
      <h1>📊 BYOD Secure Workspace Dashboard</h1>

      <div className="grid-container">
        {/* 👤 Employee Info */}
        <div className="card">
          <h2>👤 Employee Details</h2>
          <p><strong>Name:</strong> Rameshwari Singh</p>
          <p><strong>Department:</strong> IT</p>
          <p><strong>Role:</strong> Intern</p>
          <p><strong>Joined:</strong> March 2024</p>
        </div>

        {/* 🗂 Folder Monitoring Info */}
        <div className="card">
          <h2>🗂 Folder Monitoring</h2>
          <p><strong>Monitored Folder:</strong> C:/CyberSecure_Workspace</p>
          <p><strong>Status:</strong> ✅ Active</p>
          <p><strong>Last Updated:</strong> {lastUpdated || 'Loading...'}</p>
        </div>
      </div>

      {/* 📋 Activity Log */}
      <div className="card full-width">
        <h2>📁 Folder Activity Logs</h2>
        {logs.length > 0 ? (
          <table className="log-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Activity</th>
                <th>File Path</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => {
                const parts = log.split('] ');
                const timestamp = parts[0].replace('[', '');
                const [activityType, filePath] = parts[1].split(': ');
                return (
                  <tr key={index}>
                    <td>{timestamp}</td>
                    <td>{activityType}</td>
                    <td>{filePath}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No folder activity detected yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

