import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Accordion } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { fetchNews } from '../../utils/api';
import headerImg from '../../utils/images/home-page-header.jpg';
import './Home.css';

const Home = () => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        const loadNews = async () => {
            const data = await fetchNews();
            // Take the latest 3 items
            setNewsItems(data.reverse().slice(0, 3));
        };
        loadNews();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <header
                className="hero-section text-white text-center d-flex align-items-center justify-content-center position-relative"
                style={{
                    backgroundImage: `url(${headerImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '85vh',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}></div>
                <Container className="position-relative z-1">
                    <h1 className="display-2 fw-bold mb-4 text-shadow">{translations.home.hero.title}</h1>
                    <p className="lead mb-5 fs-3 text-shadow opacity-90">{translations.home.hero.subtitle}</p>
                    <Button variant="primary" size="lg" className="rounded-pill px-5 py-3 fs-5 fw-bold shadow-lg hover-scale">
                        {translations.home.hero.cta}
                    </Button>
                </Container>
            </header>

            {/* About Snippet */}
            <section className="py-5">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <h2 className="mb-4 text-primary fw-bold">{translations.home.about.title}</h2>
                            <p className="lead text-muted">{translations.home.about.description}</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Initiatives Snippet */}
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-5 text-primary fw-bold">{translations.home.initiatives.title}</h2>
                    <Row>
                        {[1, 2, 3].map((item) => (
                            <Col md={4} key={item} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 hover-card">
                                    <Card.Body className="text-center p-4">
                                        <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                            <span className="fs-3">{item}</span>
                                        </div>
                                        <Card.Title className="fw-bold">Initiative {item}</Card.Title>
                                        <Card.Text className="text-muted">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* News Snippet */}
            <section className="py-5">
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
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </small>
                                            <Card.Title className="fw-bold">{item.title}</Card.Title>
                                            <Card.Text className="text-muted text-truncate" style={{ maxHeight: '3em', overflow: 'hidden' }}>
                                                {item.content}
                                            </Card.Text>
                                            <a href="#" className="text-primary text-decoration-none fw-bold">
                                                {translations.home.news.readMore} &rarr;
                                            </a>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center">
                                <p className="text-muted">No news available.</p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>

            {/* FAQ Section */}
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-5 text-primary fw-bold">{translations.home.faq.title}</h2>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Accordion defaultActiveKey="0" flush>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>{translations.home.faq.q1}</Accordion.Header>
                                    <Accordion.Body>
                                        {translations.home.faq.a1}
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>{translations.home.faq.q2}</Accordion.Header>
                                    <Accordion.Body>
                                        {translations.home.faq.a2}
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>{translations.home.faq.q3}</Accordion.Header>
                                    <Accordion.Body>
                                        {translations.home.faq.a3}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Home;
