import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import enContent from './en.json';
import arContent from './ar.json';
import './About.css';

const About = () => {
    const { language } = useLanguage();
    const content = language === 'en' ? enContent : arContent;

    return (
        <div className="about-page">
            <Container className="py-5">
                {/* 3rd section */}
                <section className="trustee-section mb-5">
                    <h2 className="text-center fw-bold mb-5">
                        {content.trusteeTitle}
                    </h2>
                    <Row className="g-4">
                        {content.cards.map((card, idx) => (
                            <Col md={6} lg={3} key={idx}>
                                <Card className="h-100 shadow-sm border-0 text-center">
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
            </Container>
        </div>
    );
};

export default About;