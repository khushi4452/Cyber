import { useEffect, useState } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [scanning, setScanning] = useState(false); // For popup display


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
  .then(async (res) => {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await res.json();

     if ('sensitive' in json && json.sensitive === true) {
  setFileContent('❗ This file contains confidential data and cannot be previewed.');
} else if ('message' in json) {
  setFileContent(`⚠️ ${json.message}`);
} else {
  setFileContent('⚠️ Unexpected JSON response');
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

<div className="file-preview"> <h3>📄 Preview: {selectedFile}</h3> <pre>{fileContent}</pre>

{/* ✅ New Download Button */}
<button
  onClick={async () => {
    
    setScanning(true); // Show popup

    const start = Date.now(); // Record time

    try {

         
        const res = await fetch(`http://localhost:5000/api/upload/${selectedFile}`);
        
        const elapsed = Date.now() - start;
      const waitTime = Math.max(1500 - elapsed, 0); // Ensure at least 1.5s

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
            alert(json.message || "Download blocked by system.");
    }, waitTime);
       return;
      }

       const blob = await res.blob();
     
       setTimeout(() => {
        setScanning(false); // Hide popup
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = selectedFile.replace(".enc", "");
        link.click();
      }, waitTime);
    } catch (err) {
      const elapsed = Date.now() - start;
      const waitTime = Math.max(1500 - elapsed, 0);

      setTimeout(() => {
        setScanning(false); // Hide popup
        alert("Something went wrong during download.");
      }, waitTime);
    }
  }}
  className="download-button"
>


  
  ⬇️ Download File
</button>
</div> )}
        </>
      )}

      {/* ✅ Scanning Popup */}
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
