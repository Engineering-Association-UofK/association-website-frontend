import React, { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useCreateGalleryItem } from '../../features/gallery/hooks/useGallery';
import ImageUpload from '../../components/ImageUpload';
import { useFileUpload } from '../../hooks/useFileUpload';
import TextareaAutosize from 'react-textarea-autosize';

const GalleryEntry = () => {

    const { id } = useParams();
    
    const navigate = useNavigate();
    const createMutation = useCreateGalleryItem();
    const { upload, isUploading, uploadError } = useFileUpload();

    const isPending = createMutation.isPending || isUploading;
    const error = createMutation.error;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageLink: "",
    });

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Form Data: ", formData);

        try {
            const finalImageUrl = await upload(formData.imageLink);

            const payload = {
                ...formData,
                imageLink: finalImageUrl,
                type: "news"
            };

            // CREATE LOGIC
            createMutation.mutate(payload, {
                onSuccess: () => navigate('/admin/gallery'),
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
                        onClick={() => navigate(`/admin/gallery`)}
                        disabled={isPending}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <h4>Add gallery item</h4>
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

                                    {isUploading ? 'Uploading Image...' : 'Saving...'}
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
                {uploadError && <Alert variant="danger">{uploadError}</Alert>}

                {createMutation.isError && (
                    <Alert variant="danger">
                        Failed to save gallery item: {createMutation.error?.message}
                    </Alert>
                )}

                <Row className="mb-3">
                    <Col md={12}>
                        <ImageUpload 
                            value={formData.imageLink} 
                            onChange={(urlOrFile) => setFormData({ ...formData, imageLink: urlOrFile })}
                            disabled={isPending}  
                        />
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        name="title"
                        type="text" 
                        placeholder="Enter title" 
                        value={formData.title}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as={TextareaAutosize}
                        name="description" 
                        minRows={3}
                        maxRows={15}
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>
            </div>
        </Form>
    </>
  )
}

export default GalleryEntry