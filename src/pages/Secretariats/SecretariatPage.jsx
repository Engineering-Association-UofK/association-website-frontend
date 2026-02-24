import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { usePublicSecretariat } from '../../features/secretariats/hooks/useSecretariats';
import './Secretariats.css';

const SecretariatPage = () => {
    const { id } = useParams();
    const { translations, language } = useLanguage();
    const { data: secretariat, isLoading, error } = usePublicSecretariat(id);
    const t = translations.home?.secretariatsPage || {};
    const isRtl = language === 'ar';

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {error.response?.data?.message || error.message || t.errorLoading || 'Failed to load secretariat'}
                </Alert>
            </Container>
        );
    }

    if (!secretariat) {
        return (
            <Container className="py-5">
                <Alert variant="warning">{t.notFound || 'Secretariat not found'}</Alert>
            </Container>
        );
    }

    return (
        <article className="secretariat-detail-page bg-light min-vh-100 pb-5">
            {/* Hero Header */}
            <div
                className="position-relative w-100 mb-5"
                style={{
                    height: '50vh',
                    minHeight: '400px',
                    backgroundColor: '#003366',
                    backgroundImage: secretariat.imageLink ? `url(${secretariat.imageLink})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                ></div>

                <Container className="position-relative h-100 d-flex flex-column justify-content-end pb-5 text-white">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h1 className="display-4 fw-bold mb-3">{secretariat.title}</h1>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Content */}
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
                            <p className="fs-5 lh-lg text-secondary">{secretariat.description}</p>

                            <hr className="my-5 opacity-25" />

                            <div className="d-flex justify-content-between align-items-center">
                                <Button
                                    as={Link}
                                    to="/secretariats"
                                    variant="outline-primary"
                                    className="rounded-pill px-4 fw-bold"
                                >
                                    {isRtl ? '→' : '←'} {t.backToSecretariats || 'Back to Secretariats'}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </article>
    );
};

export default SecretariatPage;
