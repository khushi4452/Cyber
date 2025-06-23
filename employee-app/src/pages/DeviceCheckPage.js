import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // ✅/❌ icons
import "./DeviceCheckPage.css";

function DeviceCheckPage() {
  const navigate = useNavigate();
  const [checkResult, setCheckResult] = useState(null);

  useEffect(() => {
    const checks = {};
    checks.userAgent = navigator.userAgent;

    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      checks.privateMode = false;
    } else {
      fs(
        window.TEMPORARY,
        100,
        () => (checks.privateMode = false),
        () => (checks.privateMode = true)
      );
    }

    const lowerUA = navigator.userAgent.toLowerCase();
    checks.isEmulator = lowerUA.includes("android sdk") || lowerUA.includes("emulator");

    setTimeout(() => {
      const passed = !checks.privateMode && !checks.isEmulator;
      setCheckResult({ ...checks, passed });
    }, 1500); // Give time for loading animation
  }, []);

  const handleContinue = () => navigate("/dashboard");

  return (
    <div className="device-check-container">
      <div className="device-check-card">
        <h2>🔍 Device Checkup</h2>

        {!checkResult ? (
          <div className="loader"></div> // animated loader
        ) : checkResult.passed ? (
          <>
            <FaCheckCircle size={64} color="green" style={{ marginBottom: "1rem" }} />
            <p className="status success">✅ Device is secure</p>
            <button className="continue-btn" onClick={handleContinue}>Continue</button>
          </>
        ) : (
          <>
            <FaTimesCircle size={64} color="red" style={{ marginBottom: "1rem" }} />
            <p className="status fail">❌ Device failed security checks</p>
          </>
        )}
      </div>
    </div>
  );
}

export default DeviceCheckPage;
