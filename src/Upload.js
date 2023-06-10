import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContents, setFileContents] = useState('');

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
    uploadFile(uploadedFile);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    uploadFile(uploadedFile);
  };

  const uploadFile = (uploadedFile) => {
    const formData = new FormData();
    formData.append('file', uploadedFile);

    axios.post('http://localhost:3000/upload', formData)
      .then((response) => {
        console.log('File uploaded successfully', response);
        // readFileContents(response.data.fileUrl);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const readFileContents = (fileUrl) => {
    axios.get(`http://localhost:3000/read/${encodeURIComponent(fileUrl)}`)
      .then((response) => {
        setFileContents(response.data.fileContents);
      })
      .catch((error) => {
        console.error('Error reading file:', error);
      });
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
            <div className="file-contents">{fileContents}</div>
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
