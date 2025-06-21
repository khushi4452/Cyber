import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Upload from './Upload';
import './Dashboard.css';

const DashboardHome = ({ logs, lastUpdated }) => (
  <>
    <h1>📈 Admin Overview</h1>

    <div className="cards">
      <div className="card green">
        <h3>Total Users</h3>
        <p>42 registered</p>
      </div>
      <div className="card blue">
        <h3>Active Sessions</h3>
        <p>9 currently online</p>
      </div>
      <div className="card orange">
        <h3>Files Uploaded</h3>
        <p>18 uploaded today</p>
      </div>
    </div>

    <div className="grid-container">
      <div className="card-section">
        <h2>👤 Employee Details</h2>
        <p><strong>Name:</strong> Rameshwari Singh</p>
        <p><strong>Department:</strong> IT</p>
        <p><strong>Role:</strong> Intern</p>
        <p><strong>Joined:</strong> March 2024</p>
      </div>

      <div className="card-section">
        <h2>🗂 Folder Monitoring</h2>
        <p><strong>Monitored Folder:</strong> C:/CyberSecure_Workspace</p>
        <p><strong>Status:</strong> ✅ Active</p>
        <p><strong>Last Updated:</strong> {lastUpdated || 'Loading...'}</p>
      </div>
    </div>

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
  </>
);

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const location = useLocation();

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
    <div className="dashboard">
      <aside className="sidebar">
        <h2>🛡 Admin</h2>
        <nav>
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/dashboard/upload">📤 Upload</Link>
          <Link to="/dashboard/logs">📜 Logs</Link>
        </nav>
        <button className="theme-toggle">🌙 Dark</button>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardHome logs={logs} lastUpdated={lastUpdated} />} />
          <Route path="upload" element={<Upload />} />
          {/* Add logs route if you have a Logs component */}
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
