import React, { useState } from 'react';

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const uploadedFile = e.dataTransfer.files[0];
    setFile(uploadedFile);
    // Perform further operations with the uploaded file
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    // Perform further operations with the uploaded file
  };

  return (
    <div className="upload-container">
      <div className="upload-header">Upload File</div>
      <div
        className={`upload-content ${isDragOver ? 'drag-over' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="upload-file">
            <div className="file-name">{file.name}</div>
          </div>
        ) : (
          <div className="upload-dropzone">
            <p>Drag and drop a file here, or click to browse</p>
            <input type="file" id="file" className="file-input" onChange={handleFileChange} />
            <label htmlFor="file" className="file-label">
              Choose a file
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
