import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const RegisterForm = () => {
    const { translations } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Registration failed');
            }

            // Redirect to login page upon successful registration
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <Col md={6} lg={5}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Card.Body className="p-5">
                            <h2 className="text-center fw-bold text-primary mb-4">{translations.register.title}</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>{translations.register.username}</Form.Label>
                                    <Form.Control type="text" name="username" placeholder={translations.register.username} value={formData.username} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>{translations.register.email}</Form.Label>
                                    <Form.Control type="email" name="email" placeholder={translations.register.emailExample} value={formData.email} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>{translations.register.password}</Form.Label>
                                    <Form.Control type="password" name="password" placeholder={translations.register.password} value={formData.password} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="formConfirmPassword">
                                    <Form.Label>{translations.register.confirmPassword}</Form.Label>
                                    <Form.Control type="password" name="confirmPassword" placeholder={translations.register.confirmPassword} value={formData.confirmPassword} onChange={handleChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
                                    {loading ? translations.register.loading : translations.register.register}
                                </Button>
                            </Form>
                            <div className="text-center mt-4 text-muted">
                                {translations.register.haveAccount} <Link to="/login" className="text-primary fw-bold text-decoration-none">{translations.register.login}</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterForm;