import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../features/blogs/hooks/useBlogs.js';
import { NewsSkeleton } from './NewsSkeleton.jsx';

const NewsFeed = ({ start = 0, end = 3 }) => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';
    const arrow = isRtl ? '←' : '→';

    const { data: response, isLoading, error } = useBlogs('NEWS', 1, 10);

    if (isLoading) {
        return (
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="fw-bold mb-5">{translations.home.news?.title || "Latest News"}</h2>
                    <NewsSkeleton />
                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">Failed to load news.</Alert>
            </Container>
        );
    }

    const newsItems = response?.posts.slice(start, end) || [];

    return (
        <section className="py-5 bg-light">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="fw-bold mb-0 text-dark">
                        {translations.home.news?.title || "Latest News"}
                    </h2>
                    {/* View All Button (Desktop) */}
                    <Button 
                        as={Link} 
                        to="/posts/news" 
                        variant="outline-primary" 
                        className="d-none d-md-inline-block rounded-pill px-4 fw-medium"
                    >
                        {translations.home.news?.viewAll || "View All"} {arrow}
                    </Button>
                </div>

                {/* --- DESKTOP LAYOUT --- */}
                <Row className="d-none d-md-flex">
                    {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 transition-hover">
                                    <div
                                        className="bg-secondary"
                                        style={{
                                            height: '220px',
                                            backgroundImage: item.image_url ? `url(${item.image_url})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: item.image_url ? 'transparent' : '#e9ecef',
                                            borderTopLeftRadius: 'calc(0.375rem - 1px)',
                                            borderTopRightRadius: 'calc(0.375rem - 1px)'
                                        }}
                                    />
                                    <Card.Body className="d-flex flex-column p-4">
                                        <small className="text-primary fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>
                                            {new Date(item.updated_at || item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                        </small>
                                        <Card.Title className="fw-bold mb-3 lh-base">
                                            {item.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted text-truncate mb-4" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', whiteSpace: 'normal' }}>
                                            {item.summary}
                                        </Card.Text>
                                        
                                        <div className="mt-auto">
                                            <Link to={`/posts/news/${item.id}`} className="text-primary text-decoration-none fw-bold d-inline-flex align-items-center gap-2">
                                                {translations.home.news?.readMore || "Read More"} <span>{arrow}</span>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-4">
                            <p className="text-muted fs-5">No news right now.</p>
                        </Col>
                    )}
                </Row>

                {/* --- MOBILE LAYOUT --- */}
                <div className="d-md-none d-flex flex-column gap-3">
                    {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                            <Card key={item.id} className="shadow-sm border-0 overflow-hidden">
                                <Row className="g-0 align-items-stretch">
                                    <Col xs={4}>
                                        <div 
                                            style={{
                                                height: '100%',
                                                minHeight: '130px',
                                                backgroundImage: item.image_url ? `url(${item.image_url})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundColor: item.image_url ? 'transparent' : '#e9ecef'
                                            }}
                                        />
                                    </Col>
                                    <Col xs={8}>
                                        <Card.Body className="p-3 h-100 d-flex flex-column">
                                            <small className="text-primary fw-bold mb-1" style={{fontSize: '0.75rem'}}>
                                                {new Date(item.updated_at || item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                            </small>
                                            <Card.Title className="fw-bold mb-2 lh-sm" style={{fontSize: '0.95rem'}}>
                                                {item.title}
                                            </Card.Title>
                                            <Card.Text className="text-muted mb-2 text-truncate" style={{ fontSize: '0.85rem' }}>
                                                {item.summary}
                                            </Card.Text>
                                            
                                            <Link to={`/posts/news/${item.id}`} className="text-primary text-decoration-none fw-bold small mt-auto d-inline-flex align-items-center gap-1">
                                                {translations.home.news?.readMore || "Read More"} <span>{arrow}</span>
                                            </Link>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-muted">No news right now</p>
                    )}
                    
                    {/* View All Button (Mobile) */}
                    {newsItems.length > 0 && (
                        <div className="text-center mt-3">
                            <Button as={Link} to="/posts/news" variant="outline-primary" className="w-100 rounded-pill py-2 fw-medium">
                                {translations.home.news?.viewAll || "View All News"} {arrow}
                            </Button>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default NewsFeed;