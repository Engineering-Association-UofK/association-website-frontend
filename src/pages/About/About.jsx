import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import enContent from './en.json';
import arContent from './ar.json';
import './About.css';

const About = () => {
    const { language } = useLanguage();
    const content = language === 'en' ? enContent : arContent;

    return (
        <div className="about-page">
            <div className="about-page-container">
                {/* first section */}
                <section className="identity-section mb-5">
                    <div className="identity-card">
                        <div className={`identity-grid ${language === 'ar' ? 'rtl-grid' : ''}`}>
                            {/* TODO: uofk image */}
                            <div className="identity-image">
                                <img
                                    src="https://placehold.co/600x400/e2e8f0/1e293b?text=Identity+Image"
                                    alt={content.identity.title}
                                />
                            </div>
                            <div className="identity-content">
                                <h2 className="fw-bold mb-4 text-primary">
                                    {content.identity.title}
                                </h2>
                                <div className="text-muted" style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                    {content.identity.text}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3rd section */}
                <section className="trustee-section mb-5">
                    <h2 className="text-center fw-bold mb-5 text-primary">
                        {content.trusteeTitle}
                    </h2>
                    <Row className="g-4">
                        {content.cards.map((card, idx) => (
                            <Col md={6} lg={3} key={idx}>
                                <Card className="trustee-card h-100 shadow-sm border-0 text-center">
                                    <Card.Body className="p-4">
                                        <div className="mb-3">
                                            {/* TODO: replace with ahmed images */}
                                            <i className={`${card.icon} fs-1 text-primary`}></i>
                                        </div>
                                        <Card.Title className="fw-bold text-primary">
                                            {card.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted">
                                            {card.text}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>
            </div>
        </div>
    );
};

export default About;