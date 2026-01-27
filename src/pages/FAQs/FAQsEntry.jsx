import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useCreateFaq, useUpdateFaq, useFaq } from '../../features/faqs/hooks/useFaqs';
import TextareaAutosize from 'react-textarea-autosize';
import './FAQsDashboard.css'

const FAQsEntry = () => {

    const { id } = useParams();
    
    const navigate = useNavigate();

    const isEditMode = id && id !== '0';

    const createMutation = useCreateFaq();
    const updateMutation = useUpdateFaq();

    // Fetch Data (Only runs if isEditMode is true)
    const { 
        data: fetchedFaq, 
        isLoading: isLoadingData, 
        isError: isFetchError 
    } = useFaq(id);

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const [formData, setFormData] = useState({
        faqId: 0,
        title: "",
        body: "",
        lang: "en",
        translations: []
    });

    // POPULATE FORM when data arrives
    useEffect(() => {
        // console.log("Fetched faq: ", fetchedFaq);
        
        if (fetchedFaq) {
            setFormData({
            faqId: fetchedFaq.faqId,
            title: fetchedFaq.title || '',
            body: fetchedFaq.body || '',
            translations: fetchedFaq.translations || []
            });
        }
    }, [fetchedFaq]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Function to handle changes in a specific translation
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
                { lang: 'ar', title: '', body: '' }
            ]
      });
    };

    const handleChildDelete = (indexToDelete) => {
        const updatedTranslations = formData.translations.filter((_, index) => index !== indexToDelete);
        
        setFormData({
            ...formData,
            translations: updatedTranslations
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            id: formData.faqId,
            translations: [
                ...formData.translations,
                {
                    title: formData.title,
                    body: formData.body,
                    lang: "en"
                }
            ]
        }
        // console.log("Form Data: ", formData, dataToSend);

        if (isEditMode) {
            // UPDATE LOGIC
            updateMutation.mutate({ data: dataToSend }, {
                onSuccess: () => navigate('/admin/faqs'),
                onError: (err) => console.error("Update failed", err)
            });
        } else {
            // CREATE LOGIC
            createMutation.mutate(dataToSend, {
                onSuccess: () => navigate('/admin/faqs'),
                onError: (err) => console.error("Create failed", err)
            });
        }
    };

    // Show Loading screen while fetching initial data for Edit
    if (isEditMode && isLoadingData) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading FAQ details...</p>
            </div>
        );
    }

    // Show Error if fetching failed
    if (isEditMode && isFetchError) {
        return <Alert variant="danger">Error loading FAQ details.</Alert>;
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
                        onClick={() => navigate(`/admin/faqs`)}
                        disabled={isPending}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <h4>Add FAQ</h4>
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
                            )
                        }
                    </Button>
                </div>
            </div>
            <div className="scrollable-container">

                {(createMutation.isError || updateMutation.isError) && (
                    <Alert variant="danger">
                        Failed to save FAQ : {error?.message}
                    </Alert>
                )}
                <Form.Group className="mb-3" controlId="formGridTitle">
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

                <Form.Group className="mb-3" controlId="formGridBody">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        as={TextareaAutosize}
                        name="body" 
                        minRows={3}
                        maxRows={15}
                        placeholder="Enter body"
                        value={formData.body}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>


                <div className="children-wrapper">
                    {formData?.translations?.map((translation, index) => (
                        <Card className='child-card mb-3' key={index} >
                            <Card.Header className='d-flex align-items-center justify-content-between'>
                                <span>Translation #{index + 1}</span>

                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleChildDelete(index)}
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
                                        {/* <option value="fr">French</option> */}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control 
                                        name="title"
                                        type="text" 
                                        placeholder="Enter title" 
                                        value={translation.title}
                                        onChange={(e) => handleTranslationChange(index, 'title', e.target.value)}
                                        disabled={isPending}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Body</Form.Label>
                                    <Form.Control
                                        as={TextareaAutosize}
                                        name="body" 
                                        minRows={3}
                                        maxRows={15}
                                        placeholder="Enter body"
                                        value={translation.body}
                                        onChange={(e) => handleTranslationChange(index, 'body', e.target.value)}
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
                    disabled={isPending}
                    onClick={handleAddTranslation}
                >
                    Add Translation
                </Button>
            </div>
        </Form>
    </>
  )
}

export default FAQsEntry