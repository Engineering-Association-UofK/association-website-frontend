import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useUpdateGalleryImage } from '../hooks/useGallery';
import { useFileUpload } from '../../../hooks/useFileUpload';
import ImageUpload from '../../../components/ImageUpload';

const EditGalleryImageButton = ({ keyword, currentData }) => {
    const { user } = useAuth();
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ title: '', imageLink: '' });
    
    const updateMutation = useUpdateGalleryImage();
    const { upload, isUploading, uploadError } = useFileUpload();

    // Check permissions
    const canEdit = user?.type === 'admin' && (user?.roles?.includes('ROLE_CONTENT_EDITOR') || user?.roles?.includes('ROLE_SUPER_ADMIN'));

    useEffect(() => {
        if (show && currentData) {
            setFormData({
                title: currentData.title || '',
                imageLink: currentData.imageLink || ''
            });
        }
    }, [show, currentData]);

    if (!canEdit) return null;

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const finalImageUrl = await upload(formData.imageLink);
            
            updateMutation.mutate({
                keyword,
                title: formData.title || 'Updated Image', // just to ensure title is not empty
                imageLink: finalImageUrl,
                type: 'store'
            }, {
                onSuccess: () => {
                    handleClose();
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const isPending = updateMutation.isPending || isUploading;

    return (
        <>
            <Button 
                variant="light" 
                size="sm" 
                className="position-absolute top-0 end-0 m-3 shadow-sm opacity-75 hover-opacity-100"
                onClick={handleShow}
                title={`Edit Image: ${keyword}`}
                style={{ zIndex: 100 }}
            >
                <i className="bi bi-pencil-fill"></i>
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Image: {keyword}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(updateMutation.isError || uploadError) && (
                            <Alert variant="danger">
                                {updateMutation.error?.response?.data?.message || uploadError || "Failed to update image"}
                            </Alert>
                        )}
                        
                        <ImageUpload 
                            value={formData.imageLink} 
                            onChange={(val) => setFormData({...formData, imageLink: val})}
                            disabled={isPending}
                            label="Select Image"
                        />

                        <Form.Group className="mb-3">
                            <Form.Label>Title / Alt Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                placeholder="Enter a description for the image"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Spinner size="sm" animation="border" className="me-2" />
                                    {isUploading ? 'Uploading...' : 'Saving...'}
                                </>
                            ) : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default EditGalleryImageButton;