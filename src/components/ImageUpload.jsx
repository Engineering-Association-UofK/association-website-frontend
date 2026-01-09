import React, { useState } from 'react'
import { Form, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { uploadService } from '../api/upload.service'; 

const ImageUpload = ({ value, onChange, label = "Cover Image" }) => {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic Validation (Optional)
        if (!file.type.startsWith('image/')) {
            setError("Please select a valid image file.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Use the service to upload
            const url = await uploadService.uploadImage(file);
            // Pass the result back to the parent form
            onChange(url);
        } catch (err) {
            setError("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange(''); // Clear the URL in the parent state
    };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      
      {/* 1. PREVIEW STATE (If URL exists) */}
      {value ? (
        <div className="d-flex flex-column border rounded p-1">
          <Image 
            src={value} 
            alt="Preview" 
            thumbnail 
            style={{ maxHeight: '200px', objectFit: 'contain' }} 
          />
          <Button 
            variant="danger" 
            size="sm" 
            className="mt-2"
            onClick={handleRemove}
            title="Remove Image"
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
      ) : (
        /* 2. UPLOAD STATE (If no URL) */
        <div className="border rounded p-4 text-center bg-light">
            {uploading ? (
                <div className="d-flex align-items-center justify-content-center">
                    <Spinner animation="border" size="sm" className="me-2"/> Uploading...
                </div>
            ) : (
                <>
                    <Form.Control 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange} 
                    />
                    <Form.Text className="text-muted">
                        Supported formats: JPG, PNG, WEBP
                    </Form.Text>
                </>
            )}
        </div>
      )}

      {error && <div className="text-danger mt-2 small">{error}</div>}
    </Form.Group>
  )
}

export default ImageUpload