import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext.jsx';

const InitiativesSection = () => {
    const { translations } = useLanguage();

    return (
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
    );
};

export default InitiativesSection;