import { useEffect, useState } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch list of files on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/upload')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch files');
        }
        return res.json();
      })
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Could not load files.');
        setLoading(false);
      });
  }, []);

  // Fetch content of selected file
  const handleFileSelect = (e) => {
    const filename = e.target.value;
    setSelectedFile(filename);
    setFileContent('Loading file...');

    fetch(`http://localhost:5000/api/upload/${filename}`)
      .then((res) => res.text())
      .then((data) => {
        setFileContent(data);
      })
      .catch((err) => {
        console.error('Error fetching file content:', err);
        setFileContent('Failed to load content');
      });
  };

  return (
    <div className="employee-page">
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
