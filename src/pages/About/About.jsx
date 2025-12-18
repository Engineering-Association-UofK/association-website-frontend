import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import './About.css';

const About = () => {
    const { translations } = useLanguage();

    return (
        <div className="about-page py-5">
            <Container>
                <Row className="mb-5 text-center">
                    <Col>
                        <h1 className="display-4 fw-bold text-primary">{translations.about.title}</h1>
                        <p className="lead text-muted w-75 mx-auto">
                            {translations.home.about.description}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5 align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <div className="bg-secondary rounded shadow-sm" style={{ height: '300px' }}></div>
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold text-primary mb-3">{translations.about.mission}</h2>
                        <p className="text-muted fs-5">
                            {translations.about.missionText}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5 align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <div className="bg-secondary rounded shadow-sm" style={{ height: '300px' }}></div>
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold text-primary mb-3">{translations.about.vision}</h2>
                        <p className="text-muted fs-5">
                            {translations.about.visionText}
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h2 className="text-center mb-5 text-primary fw-bold">{translations.about.team}</h2>
                        <Row>
                            {[1, 2, 3, 4].map((item) => (
                                <Col md={3} sm={6} key={item} className="mb-4">
                                    <Card className="border-0 shadow-sm text-center h-100 hover-card">
                                        <div className="card-img-top bg-light rounded-circle mx-auto mt-4 d-flex align-items-center justify-content-center text-secondary" style={{ width: '120px', height: '120px' }}>
                                            <span className="fs-1">👤</span>
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="fw-bold">Team Member {item}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Position</Card.Subtitle>
                                            <Card.Text className="small">
                                                Lorem ipsum dolor sit amet.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
