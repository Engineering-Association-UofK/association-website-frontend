import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {useLanguage} from "../context/LanguageContext.jsx";
import {Link} from "react-router-dom";
import {CONFIG} from "../config/index.js";

const NewsFeed = ({ start = 0, end = 3, card = true }) => {
    const { translations, language } = useLanguage();
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/blogs`);
                if (!response.ok) {
                    throw new Error('Failed to fetch news feed');
                }
                const data = await response.json();
                setNewsItems(data.reverse().slice(start, end));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="py-3"><Alert variant="danger">Error loading news: {error}</Alert></Container>;

    // For card view
    if (card) {
        return (
            <Container>
                <h2 className="text-center mb-5 text-primary fw-bold">{translations.home.news.title}</h2>
                <Row>
                    {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card className="h-100 shadow-sm border-0">
                                    <div
                                        className="bg-secondary"
                                        style={{
                                            height: '200px',
                                            backgroundImage: item.imageLink ? `url(${item.imageLink})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: item.imageLink ? 'transparent' : '#6c757d'
                                        }}
                                    ></div>
                                    <Card.Body>
                                        <small className="text-muted d-block mb-2">
                                            {new Date(item.updatedAt).toLocaleDateString()}
                                        </small>
                                        <Card.Title className="fw-bold">{item.title}</Card.Title>
                                        <Card.Text className="text-muted text-truncate" style={{ maxHeight: '3em', overflow: 'hidden' }}>
                                            {item.content}
                                        </Card.Text>
                                        <Link to={`blogs/${item.id}`} className="text-primary text-decoration-none fw-bold">
                                            {translations.home.news.readMore} &rarr;
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p className="text-muted">No news right now</p>
                        </Col>
                    )}
                </Row>
            </Container>
        );
    }
    else {
        return (
            <Container>
                <h2 className="text-center mb-5 text-primary fw-bold">{translations.home.news.title}</h2>
                <Row>
                    // TODO: Make a "List & Thumbnail" version with proper styling for mobile screens responsivity
                </Row>
            </Container>
        );
    }

};

export default NewsFeed;