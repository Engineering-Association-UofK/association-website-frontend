import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { usePublicSecretariats } from '../../features/secretariats/hooks/useSecretariats';
import './Secretariats.css';

const Secretariats = () => {
    const { translations, language } = useLanguage();
    const { data: secretariats, isLoading, error } = usePublicSecretariats();
    const t = translations.home?.secretariatsPage || {};

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
                    {error.response?.data?.message || error.message || t.errorLoading || 'Failed to load secretariats'}
                </Alert>
            </Container>
        );
    }

    return (
        <div className="secretariats-page bg-light min-vh-100 pb-5">
            {/* Header Section */}
            <div className="bg-primary text-white py-5 mb-5 shadow-sm">
                <Container className="text-center">
                    <h1 className="fw-bold display-4">{t.title || "Association's Secretariats"}</h1>
                    <p className="lead opacity-75">{t.subtitle || 'Explore our secretariats and their work'}</p>
                </Container>
            </div>

            {/* Secretariats Grid */}
            <Container>
                {secretariats && secretariats.length > 0 ? (
                    <Row className="g-4">
                        {secretariats.map((secretariat) => (
                            <Col md={6} lg={4} key={secretariat.id} className="mb-4">
                                <Link
                                    to={`/secretariats/${secretariat.id}`}
                                    className="text-decoration-none secretariat-card-link"
                                >
                                    <Card className="h-100 shadow-sm border-0 rounded-3 secretariat-card">
                                        <div
                                            className="secretariat-card-image rounded-top-3"
                                            style={{
                                                height: '200px',
                                                backgroundImage: secretariat.imageLink ? `url(${secretariat.imageLink})` : 'none',
                                                backgroundColor: secretariat.imageLink ? 'transparent' : '#003366',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                        <Card.Body className="d-flex flex-column align-items-center text-center">
                                            <Card.Title className="fw-bold text-dark mb-2">
                                                {secretariat.title}
                                            </Card.Title>
                                            <Card.Text
                                                className="text-muted"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {secretariat.description}
                                            </Card.Text>
                                            <span className="text-primary fw-bold mt-auto">
                                                {t.viewMore || 'View More'} &rarr;
                                            </span>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center py-5">
                        <h3 className="text-muted">{t.noSecretariats || 'No secretariats available.'}</h3>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Secretariats;
