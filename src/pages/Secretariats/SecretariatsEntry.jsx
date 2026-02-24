import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useCreateSecretariat, useUpdateSecretariat, useSecretariat } from '../../features/secretariats/hooks/useSecretariats';
import ImageUpload from '../../components/ImageUpload';
import { useFileUpload } from '../../hooks/useFileUpload';
import TextareaAutosize from 'react-textarea-autosize';

const SecretariatsEntry = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const isEditMode = id && id !== '0';

    const createMutation = useCreateSecretariat();
    const updateMutation = useUpdateSecretariat();
    const { upload, isUploading, uploadError } = useFileUpload();

    const {
        data: fetchedSecretariat,
        isLoading: isLoadingData,
        isError: isFetchError
    } = useSecretariat(id);

    const isPending = createMutation.isPending || updateMutation.isPending || isUploading;
    const error = createMutation.error || updateMutation.error;

    const [formData, setFormData] = useState({
        id: 0,
        title: "",
        description: "",
        imageLink: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // POPULATE FORM when data arrives
    useEffect(() => {
        if (fetchedSecretariat) {
            setFormData({
                id: fetchedSecretariat.id,
                title: fetchedSecretariat.title || '',
                description: fetchedSecretariat.description || '',
                imageLink: fetchedSecretariat.imageLink || '',
                createdAt: fetchedSecretariat.createdAt ? new Date(fetchedSecretariat.createdAt) : '',
                updatedAt: fetchedSecretariat.updatedAt ? new Date(fetchedSecretariat.updatedAt) : '',
            });
        }
    }, [fetchedSecretariat]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const finalImageUrl = await upload(formData.imageLink);

            const payload = {
                ...formData,
                imageLink: finalImageUrl
            };

            if (isEditMode) {
                // UPDATE LOGIC
                updateMutation.mutate({ data: payload }, {
                    onSuccess: () => navigate('/admin/secretariats'),
                    onError: (err) => console.error("Update failed", err)
                });
            } else {
                // CREATE LOGIC
                createMutation.mutate(payload, {
                    onSuccess: () => navigate('/admin/secretariats'),
                    onError: (err) => console.error("Create failed", err)
                });
            }
        } catch (error) {
            return;
        }
    };

    // Show Loading screen while fetching initial data for Edit
    if (isEditMode && isLoadingData) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading secretariat details...</p>
            </div>
        );
    }

    // Show Error if fetching failed
    if (isEditMode && isFetchError) {
        return <Alert variant="danger">Error loading secretariat details.</Alert>;
    }

    return (
        <>
            <Form className='entry-form' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="title-wrapper d-flex">
                        <Button
                            className='me-2'
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => navigate(`/admin/secretariats`)}
                            disabled={isPending}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </Button>
                        <h4>{isEditMode ? 'Edit' : 'Add'} Secretariat</h4>
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
                <div className="scrollable-container">

                    {/* Error Alerts */}
                    {uploadError && <Alert variant="danger">{uploadError}</Alert>}

                    {(createMutation.isError || updateMutation.isError) && (
                        <Alert variant="danger">
                            Failed to save secretariat: {error?.message}
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
                    <Form.Group className="mb-3" controlId="formGridTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            type="text"
                            placeholder="Enter secretariat title"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isPending}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridDescription">
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

export default SecretariatsEntry
