import React from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const InitiativesSection = () => {
    return (
        <section className="py-5 bg-light">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="text-primary fw-bold">
                        {'home_initiatives_intro'}
                    </h2>
                    <p className="text-muted w-75 mx-auto">{'initiatives_intro'}</p>
                </div>
                
                <Row>
                    {['home_initiative_1', 'home_initiative_2', 'home_initiative_3'].map((key, index) => (
                        <Col md={4} key={key} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 hover-card">
                                <Card.Body className="text-center p-4">
                                    <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                        <span className="fs-3">{index + 1}</span>
                                    </div>
                                    <Card.Title className="fw-bold">
                                        {`Initiative ${index + 1}`}
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        {"Loading initiative details..."}
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