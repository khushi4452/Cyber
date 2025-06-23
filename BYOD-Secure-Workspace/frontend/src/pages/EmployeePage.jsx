import { useEffect, useState, useRef } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [warningIssued, setWarningIssued] = useState(false);
  const [wipeTriggered, setWipeTriggered] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef(null);

  // ✅ Poll suspicious status every 3s
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const resp = await fetch('http://localhost:5000/api/device/status');
        const data = await resp.json();

        setWarningIssued(data.warningIssued);
        setWipeTriggered(data.wipeTriggered);

        if (data.warningIssued && !data.wipeTriggered && countdown === 10) {
          startCountdown();
        }
      } catch (e) {
        console.error('Error fetching status:', e);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const startCountdown = () => {
    if (countdownRef.current) return;
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (wipeTriggered && countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      setCountdown(0);
    }
  }, [wipeTriggered]);

  useEffect(() => {
    fetch('http://localhost:5000/api/upload')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch files');
        return res.json();
      })
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Could not load files.');
        setLoading(false);
      });
  }, []);

  const handleFileSelect = (e) => {
    const filename = e.target.value;
    setSelectedFile(filename);
    setFileContent('Loading file...');
    fetch(`http://localhost:5000/api/upload/${filename}`)
      .then((res) => res.text())
      .then((data) => setFileContent(data))
      .catch(() => setFileContent('Failed to load content'));
  };

  // 🔥 Implement the cleanup function
  const cleanupSecureFolder = () => {
    fetch('http://localhost:5000/api/device/perform-wipe', { method: 'POST' })
      .then(() => fetch('http://localhost:5000/api/admin/wipe-reset', { method: 'POST' }))
      .then(() => alert('Your secure workspace was wiped by admin.'))
      .catch((e) => console.error('Error during cleanup:', e));
  };

  // 🆕 Poll for admin-initiated wipe status every 5s
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch('http://localhost:5000/api/admin/wipe-status')
        .then((res) => res.json())
        .then((data) => {
          if (data.wipeRequested) {
            cleanupSecureFolder();
          }
        })
        .catch((e) => console.error('Error checking wipe status', e));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="employee-page">
      {warningIssued && !wipeTriggered && (
        <div className="warning-banner">
          ⚠️ Warning: Suspicious activity detected! Workspace will be wiped in {countdown}s unless activity ceases.
        </div>
      )}

      {wipeTriggered && (
        <div className="wipe-banner">🔥 Your secure workspace was wiped due to suspicious activity.</div>
      )}

      <h2>📁 Employee Workspace Files</h2>

      {loading && <p>Loading files...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && files.length === 0 && <p>No files found.</p>}

      {!loading && files.length > 0 && (
        <>
          <select value={selectedFile} onChange={handleFileSelect} className="file-dropdown">
            <option value="">📂 Select a file</option>
            {files.map((file, index) => (
              <option key={index} value={file.filename}>
                {file.originalname} ({(file.size / 1024).toFixed(1)} KB)
              </option>
            ))}
          </select>

          {selectedFile && (
            <div className="file-preview">
              <h3>📄 Preview: {selectedFile}</h3>
              <pre>{fileContent}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeePage;
