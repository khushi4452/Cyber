// employee-app/src/components/FilePreviewModal.jsx
import React from 'react'
import './FilePreviewModal.css'

export default function FilePreviewModal({ fileName, content, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{fileName}</h2>
        <pre>{content}</pre>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
