import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import TeamSection from '../../components/TeamSection';
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

                <TeamSection />
            </Container>
        </div>
    );
};

export default About;
