import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../../features/blogs/hooks/useBlogs';
import { useLanguage } from '../../../context/LanguageContext';
import './Issues.css';

const formatDate = (dateString, language) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString(language === 'en' ? 'en-US' : 'ar-EG', { month: 'short' });
    return `${day} ${month}`;
};

const SkeletonCard = ({ isMobile }) => (
    <Col md={6} lg={4}>   
        {isMobile && (
            <div className="timeline" style={{width: "20px", height: '100%'}}>
                <div style={{ height: '100%', width: '5px', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
                <div style={{ height: '1rem', width: '1rem', backgroundColor: '#e9ecef', position: 'relative', borderRadius: '50%', bottom: '100%', left: '-5px' }} className="skeleton-animation"></div>
            </div>
        )}
        <Card className="h-100 shadow-sm border-0">
            <Card.Body>
                <div style={{ height: '1.5rem', width: '100%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
                <div style={{ height: '1rem', width: '60%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
                <div style={{ height: '1.5rem', width: '80%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
            </Card.Body>
        </Card>
    </Col>
);

const Issues = () => {
    const [page, setPage] = useState(1);
    const [allPosts, setAllPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { data, isLoading, error, isFetching } = useBlogs('ISSUES', page, 10);
    const { language } = useLanguage();
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => { setIsMobile(window.innerWidth < 768); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        if (data?.posts) {
            if (page === 1) setAllPosts(data.posts);
            else setAllPosts(prev => [...prev, ...data.posts]);
            setHasMore(page < data.pages);
        }
    }, [data, page]);

    const loadMore = () => {
        if (hasMore && !isFetching) setPage(prev => prev + 1);
    };

    if ((isLoading || error) && page === 1 && allPosts.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Row className="g-4">
                    {[...Array(12)].map((_, i) => <SkeletonCard isMobile={isMobile} key={`skeleton-${i}`} />)}
                </Row>
                <div className="py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="text-center fw-bold mb-5 text-primary">
                {language === 'en' ? 'Issues & Topics' : 'القضايا والموضوعات'}
            </h1>

            <Row className="g-4">
                {allPosts.map((post) => (
                    <Col md={6} lg={4} key={post.slug}>
                        <Card className="h-100 shadow-sm border-0 hover-card">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold text-primary">{post.title}</Card.Title>
                                <Card.Text className="text-muted">{
                                    post.summary.length > 80 ? post.summary.slice(0, 70) + '...' : post.summary
                                        || 'No summary available.'
                                }</Card.Text>
                                <div className="text-muted small mb-3 author">
                                    <i className="bi bi-person-circle me-1"></i> {post.author_name}
                                    <span className="mx-2">•</span>
                                    <i className="bi bi-calendar3 me-1"></i> {new Date(post.updated_at).toLocaleDateString()}
                                </div>
                                <Link to={`/posts/issues/${post.slug}`} className="btn btn-outline-primary rounded-pill mt-auto">
                                    {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
                                    <i className={`bi bi-arrow-${language === 'en' ? 'right' : 'left'} ms-1`}></i>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

                {isFetching && page > 1 && (
                    <>
                        {[...Array(3)].map((_, i) => <SkeletonCard key={`fetch-skeleton-${i}`} />)}
                    </>
                )}
            </Row>

            {error && page > 1 && (
                <Alert variant="danger" className="mt-4">
                    {language === 'en' ? 'Failed to load more issues.' : 'فشل في تحميل المزيد من القضايا.'}
                </Alert>
            )}

            {hasMore && (
                <div className="text-center mt-5">
                    <Button variant="primary" onClick={loadMore} disabled={isFetching} className="rounded-pill px-4 py-2">
                        {isFetching ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                {language === 'en' ? 'Loading...' : 'يتم التحميل...'}
                            </>
                        ) : (
                            <>
                                {language === 'en' ? 'Load More' : 'تحميل المزيد'}
                                <i className="bi bi-chevron-down ms-2"></i>
                            </>
                        )}
                    </Button>
                </div>
            )}

            {!hasMore && allPosts.length > 0 && (
                <div className="text-center mt-5 text-muted">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    {language === 'en' ? "You've reached the end" : 'لقد وصلت إلى النهاية'}
                </div>
            )}
        </Container>
    );
};

export default Issues;