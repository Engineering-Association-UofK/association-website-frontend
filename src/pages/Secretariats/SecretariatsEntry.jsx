import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useCreateSecretariat, useUpdateSecretariat, useSecretariat } from '../../features/secretariats/hooks/useSecretariats';
import '../FAQs/FAQsDashboard.css';

const SecretariatsEntry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== '0';

    const createMutation = useCreateSecretariat();
    const updateMutation = useUpdateSecretariat();

    // Fetch Data (Only runs if isEditMode is true)
    const {
        data: fetchedSecretariat,
        isLoading: isLoadingData,
        isError: isFetchError
    } = useSecretariat(id);

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const [formData, setFormData] = useState({
        secretariatId: 0,
        name: '',
        description: '',
        lang: 'en',
        offices: [],
        translations: []
    });

    // POPULATE FORM when data arrives
    useEffect(() => {
        if (fetchedSecretariat) {
            setFormData({
                secretariatId: fetchedSecretariat.secretariatId || fetchedSecretariat.id || 0,
                name: fetchedSecretariat.name || fetchedSecretariat.title || '',
                description: fetchedSecretariat.description || fetchedSecretariat.body || '',
                offices: fetchedSecretariat.offices || [],
                translations: fetchedSecretariat.translations || []
            });
        }
    }, [fetchedSecretariat]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle office changes
    const handleOfficeChange = (index, field, value) => {
        const updatedOffices = [...formData.offices];
        updatedOffices[index] = {
            ...updatedOffices[index],
            [field]: value
        };
        setFormData({
            ...formData,
            offices: updatedOffices
        });
    };

    const handleAddOffice = () => {
        setFormData({
            ...formData,
            offices: [
                ...formData.offices,
                { name: '', description: '', subtitle: '' }
            ]
        });
    };

    const handleDeleteOffice = (indexToDelete) => {
        const updatedOffices = formData.offices.filter((_, index) => index !== indexToDelete);
        setFormData({
            ...formData,
            offices: updatedOffices
        });
    };

    // Handle translation changes
    const handleTranslationChange = (index, field, value) => {
        const updatedTranslations = [...formData.translations];
        updatedTranslations[index] = {
            ...updatedTranslations[index],
            [field]: value
        };
        setFormData({
            ...formData,
            translations: updatedTranslations
        });
    };

    const handleAddTranslation = () => {
        setFormData({
            ...formData,
            translations: [
                ...formData.translations,
                { lang: 'ar', name: '', description: '' }
            ]
        });
    };

    const handleDeleteTranslation = (indexToDelete) => {
        const updatedTranslations = formData.translations.filter((_, index) => index !== indexToDelete);
        setFormData({
            ...formData,
            translations: updatedTranslations
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            id: formData.secretariatId,
            name: formData.name,
            description: formData.description,
            offices: formData.offices,
            translations: [
                ...formData.translations,
                {
                    name: formData.name,
                    description: formData.description,
                    lang: 'en'
                }
            ]
        };

        if (isEditMode) {
            updateMutation.mutate({ data: dataToSend }, {
                onSuccess: () => navigate('/admin/secretariats'),
                onError: (err) => console.error('Update failed', err)
            });
        } else {
            createMutation.mutate(dataToSend, {
                onSuccess: () => navigate('/admin/secretariats'),
                onError: (err) => console.error('Create failed', err)
            });
        }
    };

    // Loading state
    if (isEditMode && isLoadingData) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading Secretariat details...</p>
            </div>
        );
    }

    // Error state
    if (isEditMode && isFetchError) {
        return <Alert variant="danger">Error loading Secretariat details.</Alert>;
    }

    return (
        <>
            <Form className="entry-form" onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="title-wrapper d-flex">
                        <Button
                            className="me-2"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => navigate(`/admin/secretariats`)}
                            disabled={isPending}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </Button>
                        <h4>{isEditMode ? 'Edit Secretariat' : 'Add Secretariat'}</h4>
                    </div>
                    <div className="actions-wrapper">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : (
                                <i className="bi pe-none bi-floppy2-fill"></i>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="scrollable-container">
                    {/* Name Field */}
                    <Form.Group className="mb-3" controlId="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            type="text"
                            placeholder="Enter secretariat name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isPending}
                        />
                    </Form.Group>

                    {/* Description Field */}
                    <Form.Group className="mb-3" controlId="formGridDescription">
                        <Form.Label>Description</Form.Label>
                        <textarea
                            name="description"
                            className="form-control"
                            rows="4"
                            placeholder="Enter secretariat description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isPending}
                        />
                    </Form.Group>

                    {/* Offices Section */}
                    <div className="mb-4">
                        <h5 className="mb-3">Offices</h5>
                        <div className="children-wrapper">
                            {formData.offices?.map((office, index) => (
                                <Card className="child-card mb-3" key={index}>
                                    <Card.Header className="d-flex align-items-center justify-content-between">
                                        <span>Office #{index + 1}</span>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteOffice(index)}
                                        >
                                            <i className="bi pe-none bi-trash-fill"></i>
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Office Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter office name"
                                                value={office.name}
                                                onChange={(e) => handleOfficeChange(index, 'name', e.target.value)}
                                                disabled={isPending}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Subtitle (Optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter subtitle/tagline"
                                                value={office.subtitle || ''}
                                                onChange={(e) => handleOfficeChange(index, 'subtitle', e.target.value)}
                                                disabled={isPending}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Enter office description"
                                                value={office.description}
                                                onChange={(e) => handleOfficeChange(index, 'description', e.target.value)}
                                                disabled={isPending}
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleAddOffice}
                            disabled={isPending}
                        >
                            <i className="bi bi-plus me-1"></i>
                            Add Office
                        </Button>
                    </div>

                    {/* Translations Section */}
                    <div className="mb-4">
                        <h5 className="mb-3">Translations</h5>
                        <div className="children-wrapper">
                            {formData.translations?.map((translation, index) => (
                                <Card className="child-card mb-3" key={index}>
                                    <Card.Header className="d-flex align-items-center justify-content-between">
                                        <span>Translation #{index + 1}</span>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteTranslation(index)}
                                        >
                                            <i className="bi pe-none bi-trash-fill"></i>
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3" controlId="formGridLang">
                                            <Form.Label>Language</Form.Label>
                                            <Form.Select
                                                name="lang"
                                                value={translation.lang}
                                                onChange={(e) => handleTranslationChange(index, 'lang', e.target.value)}
                                                disabled={isPending}
                                            >
                                                <option value="en">English</option>
                                                <option value="ar">Arabic</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter translated name"
                                                value={translation.name}
                                                onChange={(e) => handleTranslationChange(index, 'name', e.target.value)}
                                                disabled={isPending}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Enter translated description"
                                                value={translation.description}
                                                onChange={(e) => handleTranslationChange(index, 'description', e.target.value)}
                                                disabled={isPending}
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleAddTranslation}
                            disabled={isPending}
                        >
                            Add Translation
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    );
};

export default SecretariatsEntry;
