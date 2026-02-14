import React from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useGenerics } from '../../features/generics/hooks/useGenerics.js';
import EditGenericButton from '../../features/generics/components/EditGenericButton.jsx';

const InitiativesSection = () => {
    
    // Define the keywords we need for this section
    const keywords = ['home_initiatives_intro', 'home_initiative_1', 'home_initiative_2', 'home_initiative_3'];
    const { data: generics, isLoading } = useGenerics(keywords);

    // Helper to safely get data
    const getText = (key) => generics?.[key] || {};

    if (isLoading) {
        return (
            <section className="py-5 bg-light text-center">
                <Spinner animation="border" variant="primary" />
            </section>
        );
    }

    return (
        <section className="py-5 bg-light">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="text-primary fw-bold">
                        {getText('home_initiatives_intro').title}
                        <EditGenericButton keyword="home_initiatives_intro" currentData={getText('home_initiatives_intro')} />
                    </h2>
                    <p className="text-muted w-75 mx-auto">{getText('home_initiatives_intro').body}</p>
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
                                        {getText(key).title || `Initiative ${index + 1}`}
                                        <EditGenericButton keyword={key} currentData={getText(key)} />
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        {getText(key).body || "Loading initiative details..."}
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