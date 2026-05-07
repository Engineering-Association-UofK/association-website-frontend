import React, { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
// import { useCreateGalleryItem } from '../../features/gallery/hooks/useGallery';
import ImageUpload from '../../components/ImageUpload';
// import { useFileUpload } from '../../hooks/useFileUpload';
import TextareaAutosize from 'react-textarea-autosize';
import { useCreateImageStorageItem } from '../../features/image storage/hooks/useImageStorage';

const ImageStorageEntry = () => {
    
    const navigate = useNavigate();
    const createMutation = useCreateImageStorageItem();

    const isPending = createMutation.isPending;
    const error = createMutation.error;

    const [formData, setFormData] = useState({
        file_name: "",
        alt_text: "",
        imageLink: "",
    });
 
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Form Data: ", formData);
        if (!formData.file_name.trim()) {
            setValidationError('File name is required.');
            return;
        }

        try {
            // const { secureUrl, publicId } = await upload(formData.imageLink);

            const payload = {
                file: formData.imageLink,
                file_name: formData.file_name.trim(),
                alt_text: formData.alt_text.trim(),
            };

            // CREATE LOGIC
            createMutation.mutate(payload, {
                onSuccess: () => navigate('/admin/image-storage'),
                onError: (err) => console.error("Create failed", err)
            });
        } catch (error) {
            return;
        }
    };

  return (
    <>
        <Form className='entry-form' onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="title-wrapper d-flex">
                    <Button 
                        className='me-2' 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigate(`/admin/image-storage`)}
                        disabled={isPending}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <h4>Add image</h4>
                </div>
                <div className="actions-wrapper">
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                                <>
                                    <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <i className="bi pe-none bi-floppy2-fill"></i>
                            )
                        }
                    </Button>
                </div>
            </div>

            <div className="scrollable-container" >

                {/* Error Alerts */}
                {/* {uploadError && <Alert variant="danger">{uploadError}</Alert>} */}

                {createMutation.isError && (
                    <Alert variant="danger">
                        Failed to save image: {error?.message}
                    </Alert>
                )}

                <Row className="mb-3">
                    <Col md={12}>
                        <ImageUpload 
                            value={formData.imageLink} 
                            onChange={(urlOrFile) => setFormData({ ...formData, imageLink: urlOrFile })}
                            disabled={isPending}
                            label=''  
                        />
                    </Col>
                </Row>
 
                {/* File name */}
                <Form.Group className="mb-3">
                <Form.Label>File Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    name="file_name"
                    type="text"
                    placeholder="Enter a file name"
                    value={formData.file_name}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                />
                </Form.Group>

                {/* Alt text */}
                <Form.Group className="mb-3">
                <Form.Label>
                    Alt Text <span className="text-muted small">(optional — for accessibility)</span>
                </Form.Label>
                <Form.Control
                    name="alt_text"
                    type="text"
                    placeholder="Describe the image for screen readers"
                    value={formData.alt_text}
                    onChange={handleChange}
                    disabled={isPending}
                />
                </Form.Group>
            </div>
        </Form>
    </>
  )
}

export default ImageStorageEntry