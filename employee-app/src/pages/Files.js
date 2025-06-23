import { useEffect, useState } from 'react';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/files')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(err => console.error('Failed to load files:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Your Secure Drive Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file} style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setSelectedFile(file)}>
            {file}
          </li>
        ))}
      </ul>

      {selectedFile && (
        <iframe
          src={`http://localhost:5000/api/files/${selectedFile}`}
          style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
          title="Secure File Preview"
        />
      )}
    </div>
  );
}
