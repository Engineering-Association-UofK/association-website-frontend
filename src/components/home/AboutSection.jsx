import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutSection = ({title, description}) => {

    return (
        <section className="py-5">
            <Container>
                <Row className="justify-content-center text-center">
                    <Col lg={8}>
                        <h2 className="mb-4 text-primary fw-bold">{title}</h2>
                        <p className="lead text-muted">{description}</p>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutSection;