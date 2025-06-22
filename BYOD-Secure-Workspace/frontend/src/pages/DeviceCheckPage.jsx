import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeviceCheckPage.css';

const DeviceCheckPage = () => {
  const navigate = useNavigate();
  const [checkResult, setCheckResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/device/check', {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCheckResult(data);
        } else {
          setError(data.reason || 'Device check failed');
        }
      })
      .catch((err) => {
        setError('Could not connect to backend');
      });
  }, []);

 const handleContinue = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'admin') {
    navigate('/dashboard');
  } else {
    navigate('/employee');
  }
};


  return (
    <div className="device-check-container">
      <div className="device-check-card">
        <h2>🔍 Device Checkup</h2>
        {!checkResult && !error ? (
          <p>Running checks...</p>
        ) : checkResult ? (
          <>
            <p>✅ Device Passed: {checkResult.osInfo.platform}</p>
            <button onClick={handleContinue}>Continue</button>
          </>
        ) : (
          <p>❌ {error}</p>
        )}
      </div>
    </div>
  );
};

export default DeviceCheckPage;
