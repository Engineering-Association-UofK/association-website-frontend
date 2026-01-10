import {Accordion, Alert, Col, Container, Row, Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useLanguage} from "../context/LanguageContext.jsx";
import {CONFIG} from "../config/index.js";


const FAQsList = () => {
    const { translations, language } = useLanguage();
    const [FAQsItems, setFAQsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/faqs?lang=${language}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch news feed');
                }
                const data = await response.json();
                setFAQsItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, [language]);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="py-3"><Alert variant="danger">Error loading FAQ list: {error}</Alert></Container>;

    return (
        <section className="py-5 bg-light">
            <Container>
                <h2 className="text-center mb-5 text-primary fw-bold">{translations.home.faq.title}</h2>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Accordion defaultActiveKey="0" flush>
                            {FAQsItems.length > 0 ? (
                                FAQsItems.map((item) => (
                                    <Accordion.Item eventKey={item.id}>
                                        <Accordion.Header>{item.title}</Accordion.Header>
                                        <Accordion.Body>
                                            {item.body}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))
                            ) : (
                                <Col className="text-center">
                                    <p className="text-muted">Check again later</p>
                                </Col>
                            )}
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default FAQsList;