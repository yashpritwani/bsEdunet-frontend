import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContents, setFileContents] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

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

  const handleInputChange = (e) => {
    setFileContents(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const uploadFile = async (uploadedFile) => {
    const formData = new FormData();
    formData.append('file', uploadedFile);

    await axios
      .post(`${process.env.REACT_APP_HOST_BACKEND}/uploadAndEncryptToBlockChain?category=${category}`, formData)
      .then((response) => {
        console.log('File uploaded successfully', response);
        alert('File uploaded successfully');
        fetchUploadedFiles(); // Refresh the uploaded files list
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const fetchUploadedFiles = () => {
    axios
      .get(`${process.env.REACT_APP_HOST_BACKEND}/fetchUndecryptedFiles`)
      .then((response) => {
        setUploadedFiles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching uploaded files:', error);
      });
  };

  const handleFileSelection = (fileId) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileId)) {
        return prevSelectedFiles.filter((file) => file !== fileId);
      } else {
        return [...prevSelectedFiles, fileId];
      }
    });
  };

  const processSelectedFiles = async () => {
    console.log('Selected files:', selectedFiles);
    const data = selectedFiles.map((item) => {
      return { fileId: item };
    });
    console.log('Data:', data);
    await axios
      .post(`${process.env.REACT_APP_HOST_BACKEND}/decryptFileAndStoreToMongo`, { data })
      .then((response) => {
        const fileContents = response.data.fileContents;
        setFileContents(fileContents);
        alert(`File processed successfully:\n\n${fileContents}`);
      })
      .catch((error) => {
        console.error('Error processing files:', error);
      });
  };

  return (
    <div className="upload-container" style={{ textAlign: 'center' }}>
      <div className="upload-header" style={{ fontSize: '20px', marginBottom: '10px' }}>
        Upload File
      </div>
      <div className="category-container" style={{ marginBottom: '20px' }}>
        <label htmlFor="categoryInput" style={{ marginRight: '10px', fontSize: '16px' }}>
          Type Category before Upload:
        </label>
        <input
          type="text"
          id="categoryInput"
          onChange={handleCategory}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '300px',
          }}
        />
      </div>
      <div
        className={`upload-content ${isDragOver ? 'drag-over' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #ddd',
          borderRadius: '5px',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: isDragOver ? '#f5f5f5' : 'transparent',
        }}
      >
        {file ? (
          <div className="upload-file">
            <div className="file-name" style={{ marginBottom: '10px' }}>
              {file.name}
            </div>
            <div className="file-contents" style={{ fontSize: '14px' }}>
              {fileContents}
            </div>
          </div>
        ) : (
          <div className="upload-dropzone">
            <p style={{ fontSize: '14px' }}>Drag and drop a file here, or click to browse</p>
            <input type="file" id="file" className="file-input" onChange={handleFileChange} />
            <label
              htmlFor="file"
              className="file-label"
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-block',
                marginTop: '10px',
              }}
            >
              Choose a file
            </label>
          </div>
        )}
      </div>

      <div className="file-input-container" style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontSize: '16px' }}>
          Type Category before Upload:
        </label>
        <input
          type="text"
          value={fileContents}
          onChange={handleInputChange}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '300px',
          }}
        />
      </div>

      <div className="uploaded-files-container" style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Uploaded Files</h2>
        <ul>
          {uploadedFiles.map((uploadedFile) => (
            <li key={uploadedFile._id} style={{ marginBottom: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(uploadedFile._id)}
                  onChange={() => handleFileSelection(uploadedFile._id)}
                  style={{ marginRight: '5px' }}
                />
                {uploadedFile.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={processSelectedFiles}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Upload;
