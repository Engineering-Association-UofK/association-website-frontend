import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext.jsx';

const AboutSection = () => {
    const { translations } = useLanguage();

    return (
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
    );
};

export default AboutSection;