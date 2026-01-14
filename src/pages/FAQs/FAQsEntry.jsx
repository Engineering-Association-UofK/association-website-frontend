import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useCreateFaq, useUpdateFaq, useFaq } from '../../features/faqs/hooks/useFaqs';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './FaqsDashboard.css'

const FAQsEntry = () => {

    const { id } = useParams();
    console.log("faq Id: ", id);
    
    const navigate = useNavigate();

    const isEditMode = id && id !== '0';

    const createMutation = useCreateFaq();
    const updateMutation = useUpdateFaq();
    const { language } = useLanguage();

    // Fetch Data (Only runs if isEditMode is true)
    const { 
        data: fetchedFaq, 
        isLoading: isLoadingData, 
        isError: isFetchError 
    } = useFaq(id, {lang: language});

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const [formData, setFormData] = useState({
        // faqId: 0,
        title: "",
        body: "",
        lang: "en",
    });

    // POPULATE FORM when data arrives
    useEffect(() => {
        console.log("Fetched faq: ", fetchedFaq);
        
        if (fetchedFaq) {
            setFormData({
            faqId: fetchedFaq.faqId,
            title: fetchedFaq.title || '',
            body: fetchedFaq.body || '',
            lang: fetchedFaq.lang || 'en',
            });
        }
    }, [fetchedFaq]);

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data: ", formData);

        if (isEditMode) {
            // UPDATE LOGIC
            updateMutation.mutate({ data: formData }, {
                onSuccess: () => navigate('/admin/faqs'),
                onError: (err) => console.error("Update failed", err)
            });
        } else {
            // CREATE LOGIC
            createMutation.mutate(formData, {
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
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridLang">
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                        name="lang"
                        value={formData.lang}
                        onChange={handleChange}
                        disabled={isPending}
                    >
                        <option value="en">English</option>
                        <option value="ar">Arabic</option>
                    </Form.Select>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridBody">
                    <Form.Label>Body</Form.Label>
                    <textarea
                        name="body" 
                        className="form-control" 
                        id="exampleFormControlTextarea1" 
                        rows="3" 
                        placeholder="Enter body"
                        value={formData.body}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>
            </div>
        </Form>
    </>
  )
}

export default FAQsEntry