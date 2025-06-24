import { useEffect, useRef, useState } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [scanning, setScanning] = useState(false);
  const [warningIssued, setWarningIssued] = useState(false);
  const [wipeTriggered, setWipeTriggered] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef(null);

  // 🔐 Security Restrictions Hook
  useEffect(() => {
    const blockUserActions = (e) => e.preventDefault();

    document.addEventListener("copy", blockUserActions);
    document.addEventListener("cut", blockUserActions);
    document.addEventListener("paste", blockUserActions);
    document.addEventListener("contextmenu", blockUserActions);

    const handlePrint = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        alert("🛑 Printing is disabled in secure workspace.");
      }
    };

    const detectScreenshot = (e) => {
      if (e.key === "PrintScreen") {
        alert("📸 Screenshot attempt detected and blocked!");
      }
    };

    window.addEventListener("keydown", handlePrint);
    window.addEventListener("keyup", detectScreenshot);

    return () => {
      document.removeEventListener("copy", blockUserActions);
      document.removeEventListener("cut", blockUserActions);
      document.removeEventListener("paste", blockUserActions);
      document.removeEventListener("contextmenu", blockUserActions);
      window.removeEventListener("keydown", handlePrint);
      window.removeEventListener("keyup", detectScreenshot);
    };
  }, []);

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
      .then(async (res) => {
        const contentType = res.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const json = await res.json();

          if ('sensitive' in json && json.sensitive === true) {
            setFileContent('❗ This file contains confidential data and cannot be previewed.');
          } else if ('message' in json) {
            setFileContent(`⚠ ${json.message}`);
          } else {
            setFileContent('⚠ Unexpected JSON response');
          }
        } else {
          const text = await res.text();
          setFileContent(text);
        }
      })
      .catch((err) => {
        console.error('Error fetching file content:', err);
        setFileContent('Failed to load content');
      });
  };

  const cleanupSecureFolder = () => {
    fetch('http://localhost:5000/api/device/perform-wipe', { method: 'POST' })
      .then(() => fetch('http://localhost:5000/api/admin/wipe-reset', { method: 'POST' }))
      .then(() => alert('Your secure workspace was wiped by admin.'))
      .catch((e) => console.error('Error during cleanup:', e));
  };

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
    <div className="employee-page dark-theme">
      {warningIssued && !wipeTriggered && (
        <div className="warning-banner">
          ⚠ Warning: Suspicious activity detected! Workspace will be wiped in {countdown}s unless activity ceases.
        </div>
      )}

      {wipeTriggered && (
        <div className="wipe-banner">
          🔥 Your secure workspace was wiped due to suspicious activity.
        </div>
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

              <button
                onClick={async () => {
                  setScanning(true);
                  const start = Date.now();

                  try {
                    const res = await fetch(`http://localhost:5000/api/upload/${selectedFile}`);
                    const elapsed = Date.now() - start;
                    const waitTime = Math.max(1500 - elapsed, 0);
                    const contentType = res.headers.get('content-type');

                    if (contentType && contentType.includes('application/json')) {
                      const json = await res.json();

                      if (json.sensitive === true) {
                        setTimeout(() => {
                          setScanning(false);
                          alert('❗ This file contains confidential data and cannot be downloaded.');
                        }, waitTime);
                        return;
                      }

                      setTimeout(() => {
                        setScanning(false);
                        alert(json.message || 'Download blocked by system.');
                      }, waitTime);
                      return;
                    }

                    const blob = await res.blob();

                    setTimeout(() => {
                      setScanning(false);
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = selectedFile.replace('.enc', '');
                      link.click();
                    }, waitTime);
                  } catch (err) {
                    const elapsed = Date.now() - start;
                    const waitTime = Math.max(1500 - elapsed, 0);

                    setTimeout(() => {
                      setScanning(false);
                      alert('Something went wrong during download.');
                    }, waitTime);
                  }
                }}
                className="download-button"
              >
                ⬇ Download File
              </button>
            </div>
          )}
        </>
      )}

      {scanning && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>🔍 Scanning for sensitive info...</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;
