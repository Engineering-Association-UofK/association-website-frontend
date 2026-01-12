import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

const BlogsPage = () => {
    const { translations, language } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get('/blogs');
                const publishedBlogs = response.data.filter(blog => blog.status === 'published');
                setBlogs(publishedBlogs.reverse());
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <div className="blogs-page bg-light min-vh-100 pb-5">
            {/* Header Section */}
            <div className="bg-primary text-white py-5 mb-5 shadow-sm">
                <Container className="text-center">
                    <h1 className="fw-bold display-4">{translations.home.blogsPage.title}</h1>
                    <p className="lead opacity-75">{translations.home.blogsPage.subtitle}</p>
                    
                    {/* Search Bar */}
                    <Row className="justify-content-center mt-4">
                        <Col md={6}>
                            <InputGroup size="lg">
                                <Form.Control
                                    placeholder={translations.home.blogsPage.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-0 shadow-sm"
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>
                {filteredBlogs.length > 0 ? (
                    <>
                        {/* Featured Post (Only show if no search term is active, and we have blogs) */}
                        {!searchTerm && (
                            <div className="mb-5">
                                <h3 className="fw-bold text-primary mb-3 border-bottom pb-2 d-inline-block">
                                    {translations.home.blogsPage.latest}
                                </h3>
                                <Card className="shadow-sm border-0 overflow-hidden rounded-3">
                                    <Row className="g-0">
                                        <Col md={6} className="position-relative" style={{ minHeight: '300px' }}>
                                            <div 
                                                className="h-100 w-100"
                                                style={{
                                                    backgroundImage: filteredBlogs[0].imageLink ? `url(${filteredBlogs[0].imageLink})` : 'none',
                                                    backgroundColor: filteredBlogs[0].imageLink ? 'transparent' : '#6c757d',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Card.Body className="p-4 p-lg-5 d-flex flex-column h-100 justify-content-center">
                                                <small className="text-muted mb-2">
                                                    {new Date(filteredBlogs[0].updatedAt).toLocaleDateString()}
                                                </small>
                                                <Card.Title className="display-6 fw-bold mb-3">{filteredBlogs[0].title}</Card.Title>
                                                <Card.Text className="text-muted mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {filteredBlogs[0].content}
                                                </Card.Text>
                                                <div>
                                                    <Button as={Link} to={`/blogs/${filteredBlogs[0].id}`} variant="primary" className="rounded-pill px-4 fw-bold">
                                                        {translations.home.blogsPage.readMore}
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                        )}

                        {/* Grid for remaining posts */}
                        <Row className="g-4">
                            {/* If search is active, show all. If not, skip the first one (featured) */}
                            {(searchTerm ? filteredBlogs : filteredBlogs.slice(1)).map((blog) => (
                                <Col md={4} key={blog.id} className="mb-4">
                                    <Card className="h-100 shadow-sm border-0 rounded-3 hover-card transition-all">
                                        <div 
                                            style={{
                                                height: '200px',
                                                backgroundImage: blog.imageLink ? `url(${blog.imageLink})` : 'none',
                                                backgroundColor: blog.imageLink ? 'transparent' : '#6c757d',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                            className="rounded-top-3"
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <small className="text-muted mb-2">{new Date(blog.updatedAt).toLocaleDateString()}</small>
                                            <Card.Title className="fw-bold mb-2">{blog.title}</Card.Title>
                                            <Card.Text className="text-muted flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {blog.content}
                                            </Card.Text>
                                            <Link to={`/blogs/${blog.id}`} className="text-primary fw-bold text-decoration-none mt-3">
                                                {translations.home.blogsPage.readMore} &rarr;
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <div className="text-center py-5">
                        <h3 className="text-muted">{translations.home.blogsPage.noResults}</h3>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default BlogsPage;