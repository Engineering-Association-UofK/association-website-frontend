import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useUpdateGeneric } from '../hooks/useGenerics';
import TextareaAutosize from 'react-textarea-autosize';

const EditGenericButton = ({ keyword, currentData }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ title: '', body: '' });
    
    const updateMutation = useUpdateGeneric();

    // Check permissions
    const canEdit = user?.type === 'admin' && (user?.roles?.includes('ROLE_CONTENT_EDITOR') || user?.roles?.includes('ROLE_SUPER_ADMIN'));

    useEffect(() => {
        if (show && currentData) {
            setFormData({
                title: currentData.title || '',
                body: currentData.body || ''
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

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({
            keyword,
            lang: language,
            title: formData.title,
            body: formData.body
        }, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <>
            <Button 
                variant="outline-secondary" 
                size="sm" 
                className="ms-2 opacity-50 hover-opacity-100 border-0"
                onClick={handleShow}
                title={`Edit ${keyword}`}
                style={{ verticalAlign: 'middle' }}
            >
                <i className="bi bi-pencil-square"></i>
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Content: {keyword} ({language.toUpperCase()})</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {updateMutation.isError && (
                            <Alert variant="danger">
                                {updateMutation.error?.response?.data?.message || "Failed to update content"}
                            </Alert>
                        )}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Body (Supports HTML)</Form.Label>
                            <Form.Control
                                as={TextareaAutosize}
                                minRows={3}
                                value={formData.body}
                                onChange={(e) => setFormData({...formData, body: e.target.value})}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Spinner size="sm" animation="border" /> : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default EditGenericButton;