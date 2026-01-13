import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import MDView from '../../components/markdown/MDView';

const BlogPage = () => {
    const { id } = useParams();
    const { translations, language } = useLanguage();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get(`/blogs/${id}`);
                setBlog(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!blog) return <Container className="py-5"><Alert variant="warning">Blog not found</Alert></Container>;

    const isRtl = language === 'ar';

    return (
        <article className="blog-entry-page bg-light min-vh-100 pb-5">
            {/* Hero Header */}
            <div
                className="position-relative w-100 mb-5"
                style={{
                    height: '50vh',
                    minHeight: '400px',
                    backgroundColor: '#003366', // Fallback color
                    backgroundImage: blog.imageLink ? `url(${blog.imageLink})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Overlay */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}></div>

                <Container className="position-relative h-100 d-flex flex-column justify-content-end pb-5 text-white">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="mb-3">
                                <Badge bg="primary" className="fs-6 fw-normal px-3 py-2 rounded-pill">
                                    {new Date(blog.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Badge>
                            </div>
                            <h1 className="display-4 fw-bold mb-3">{blog.title}</h1>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Content */}
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
                            <MDView markdown={blog.content} />

                            <hr className="my-5 opacity-25" />

                            <div className="d-flex justify-content-between align-items-center">
                                <Button
                                    as={Link}
                                    to="/blogs"
                                    variant="outline-primary"
                                    className="rounded-pill px-4 fw-bold"
                                >
                                    {isRtl ? '→' : '←'} {translations.home.blogsPage?.backToBlogs}
                                </Button>

                                <small className="text-muted">
                                    {translations.home.blogsPage?.lastUpdated}: {new Date(blog.updatedAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                                </small>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </article>
    );
};

export default BlogPage;