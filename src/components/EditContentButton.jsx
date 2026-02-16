import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useUpdateGeneric } from '../features/generics/hooks/useGenerics';
import { useUpdateGalleryImage } from '../features/gallery/hooks/useGallery';
import { useFileUpload } from '../hooks/useFileUpload';
import ImageUpload from './ImageUpload';

const EditContentButton = ({ keyword, currentData, type = 'text', className, style }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [show, setShow] = useState(false);
    
    // Unified form state
    const [formData, setFormData] = useState({ 
        title: '', 
        body: '', 
        imageLink: '' 
    });

    // Hooks
    const updateGenericMutation = useUpdateGeneric();
    const updateGalleryMutation = useUpdateGalleryImage();
    const { upload, isUploading, uploadError } = useFileUpload();

    // Permissions
    const canEdit = user?.type === 'admin' && (user?.roles?.includes('ROLE_CONTENT_EDITOR') || user?.roles?.includes('ROLE_SUPER_ADMIN'));

    useEffect(() => {
        if (show && currentData) {
            setFormData({
                title: currentData.title || '',
                body: currentData.body || '',
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
        
        if (type === 'text') {
            updateGenericMutation.mutate({
                keyword,
                lang: language,
                title: formData.title,
                body: formData.body
            }, { onSuccess: handleClose });
        } else if (type === 'image') {
            try {
                const finalImageUrl = await upload(formData.imageLink);

                updateGalleryMutation.mutate({
                    keyword,
                    title: formData.title || 'Updated Image',
                    imageLink: finalImageUrl,
                    type: 'store'
                }, { onSuccess: handleClose });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const isPending = (type === 'text' ? updateGenericMutation.isPending : updateGalleryMutation.isPending) || isUploading;
    const error = (type === 'text' ? updateGenericMutation.error : updateGalleryMutation.error) || uploadError;
    const errorMessage = error?.response?.data?.message || (typeof error === 'string' ? error : "Failed to update content");

    // Button Styles
    const defaultTextClass = "ms-2 opacity-50 hover-opacity-100 border-0";
    const defaultImageClass = "position-absolute top-0 end-0 m-3 shadow-sm opacity-75 hover-opacity-100";
    
    const btnVariant = type === 'image' ? "light" : "outline-secondary";
    const btnClass = className || (type === 'image' ? defaultImageClass : defaultTextClass);
    const btnStyle = style || (type === 'image' ? { zIndex: 100 } : { verticalAlign: 'middle' });

    return (
        <>
            <Button 
                variant={btnVariant}
                size="sm" 
                className={btnClass}
                onClick={handleShow}
                title={`Edit ${type}: ${keyword}`}
                style={btnStyle}
            >
                <i className="bi bi-pencil-square"></i>
            </Button>

            <Modal show={show} onHide={handleClose} centered size={type === 'text' ? 'lg' : undefined}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {type === 'text' ? 'Content' : 'Image'}: {keyword} {type === 'text' && `(${language.toUpperCase()})`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && (
                            <Alert variant="danger">
                                {errorMessage}
                            </Alert>
                        )}
                        
                        {type === 'image' && (
                            <ImageUpload 
                                value={formData.imageLink} 
                                onChange={(val) => setFormData(prev => ({...prev, imageLink: val}))}
                                disabled={isPending}
                                label="Select Image"
                            />
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>{type === 'image' ? 'Title / Alt Text' : 'Title'}</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                                required
                                placeholder={type === 'image' ? "Enter a description for the image" : ""}
                            />
                        </Form.Group>

                        {type === 'text' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Body (Supports HTML)</Form.Label>
                                <Form.Control
                                    as={TextareaAutosize}
                                    minRows={3}
                                    value={formData.body}
                                    onChange={(e) => setFormData(prev => ({...prev, body: e.target.value}))}
                                    required
                                />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Spinner size="sm" animation="border" className="me-2" />
                                    Saving...
                                </>
                            ) : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default EditContentButton;