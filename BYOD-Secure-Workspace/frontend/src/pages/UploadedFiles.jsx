import { useEffect, useState } from 'react';
import './UploadedFiles.css'; // Ensure this file exists

const UploadedFiles = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = () => {
    fetch('http://localhost:5000/api/upload')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFiles(data.files);
      })
      .catch((err) => console.error('Failed to fetch files:', err));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (filename) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/upload/${filename}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFiles(files.filter((file) => file.filename !== filename));
      } else {
        alert('Failed to delete the file.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="uploaded-files-container">
      <h2>📁 Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="uploaded-list grid-style">
          {files.map((file, index) => (
            <li key={index} className="uploaded-item">
              <div className="file-info">
                <a
                  href={`http://localhost:5000/uploads/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.originalname}
                </a>
                <p>Uploaded: {new Date(file.uploadedAt).toLocaleString()}</p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(file.filename)}
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadedFiles;
