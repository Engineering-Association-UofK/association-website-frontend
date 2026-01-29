import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useCreateBlog, useUpdateBlog, useBlog } from '../../features/blogs/hooks/useBlogs';
import ImageUpload from '../../components/ImageUpload';
import { useFileUpload } from '../../hooks/useFileUpload';
import TextareaAutosize from 'react-textarea-autosize';
import './BlogsDashboard.css'

const BlogsEntry = () => {

    const { id } = useParams();
    
    const navigate = useNavigate();

    const isEditMode = id && id !== '0';

    const createMutation = useCreateBlog();
    const updateMutation = useUpdateBlog();
    const { upload, isUploading, uploadError } = useFileUpload();

    const { 
        data: fetchedBlog, 
        isLoading: isLoadingData, 
        isError: isFetchError 
    } = useBlog(id);

    const isPending = createMutation.isPending || updateMutation.isPending || isUploading;
    const error = createMutation.error || updateMutation.error;

    const [formData, setFormData] = useState({
        id: 0,
        title: "",
        content: "",
        authorId: 1,
        status: "draft",
        imageLink: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // POPULATE FORM when data arrives
    useEffect(() => {
        // console.log("Fetched blog: ", fetchedBlog);
        
        if (fetchedBlog) {
            setFormData({
            id: fetchedBlog.id,
            title: fetchedBlog.title || '',
            content: fetchedBlog.content || '',
            authorId: fetchedBlog.authorId,
            status: fetchedBlog.status || 'draft',
            imageLink: fetchedBlog.imageLink || '',
            // Ensure date is formatted for <input type="date"> (YYYY-MM-DD)
            createdAt: fetchedBlog.createdAt ? new Date(fetchedBlog.createdAt) : '', 
            updatedAt: fetchedBlog.updatedAt ? new Date(fetchedBlog.updatedAt) : '', 
            });
        }
    }, [fetchedBlog]);

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
                imageLink: finalImageUrl 
            };
            
            if (isEditMode) {
                // UPDATE LOGIC
                updateMutation.mutate({ data: payload }, {
                    onSuccess: () => navigate('/admin/blogs'),
                    onError: (err) => console.error("Update failed", err)
                });
            } else {
                // CREATE LOGIC
                createMutation.mutate(payload, {
                    onSuccess: () => navigate('/admin/blogs'),
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
                <p>Loading blog details...</p>
            </div>
        );
    }

    // Show Error if fetching failed
    if (isEditMode && isFetchError) {
        return <Alert variant="danger">Error loading blog details.</Alert>;
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
                        onClick={() => navigate(`/admin/blogs`)}
                        disabled={isPending}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <h4>Add blog</h4>
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
                        Failed to save blog : {error?.message}
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
                        placeholder="Enter title" 
                        value={formData.title}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>
                <Row className="mb-3">
                    {/* <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        name="createdAt" 
                        type="date" 
                        value={formData.createdAt}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                    </Form.Group> */}

                    <Form.Group as={Col} controlId="formGridStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={isPending}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </Form.Select>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as={TextareaAutosize}
                        name="content" 
                        minRows={3}
                        maxRows={15}
                        placeholder="Enter content"
                        value={formData.content}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>
            </div>
        </Form>
    </>
  )
}

export default BlogsEntry