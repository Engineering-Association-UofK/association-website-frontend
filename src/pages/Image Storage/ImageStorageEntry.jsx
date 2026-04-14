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

    const { id } = useParams();
    
    const navigate = useNavigate();
    const createMutation = useCreateImageStorageItem();
    // const { upload, isUploading, uploadError } = useFileUpload();

    const isPending = createMutation.isPending //|| isUploading;
    const error = createMutation.error;

    const [formData, setFormData] = useState({
        file_name: "test file name",
        alt_text: "test alt",
        imageLink: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data: ", formData);

        try {
            // const { secureUrl, publicId } = await upload(formData.imageLink);

            const payload = {
                file: formData.imageLink,
                file_name: formData.file_name,
                alt_text: formData.alt_text,
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

                                    {/* {isUploading ? 'Uploading Image...' : 'Saving...'} */}
                                    {'Saving...'}
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
            </div>
        </Form>
    </>
  )
}

export default ImageStorageEntry