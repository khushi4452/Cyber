import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (employeeId && password) {
      // Save employee id or token
      localStorage.setItem("employeeId", employeeId); 
      navigate("/device-check");
    } else {
      alert("Please enter Employee ID and Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Employee Login</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
          <p>&copy; 2025 BYOD Secure Workspace</p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
