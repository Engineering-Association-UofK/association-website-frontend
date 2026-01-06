import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {useLanguage} from "../context/LanguageContext.jsx";
import {CONFIG} from "../config/index.js";


const LoginForm = () => {
    const { translations } = useLanguage();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const sendVerificationCode = async () => {
        try {
            await fetch(`${CONFIG.API_BASE_URL_RAW}/admin/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
        } catch (err) {
            setError('Failed to send verification code. Please try resending.');
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isAdmin ? `${CONFIG.API_BASE_URL_RAW}/admin/login` : `${CONFIG.API_BASE_URL_RAW}/login`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });

            const text = await response.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (err) {
                // If parsing fails, we will rely on 'text' below.
            }

            const responseMessage = data.message || text;
            if (response.status === 401 && responseMessage === "Account not verified") {
                setIsVerifying(true);
                setLoading(false);
                await sendVerificationCode();
                return;
            }

            if (!response.ok) {
                throw new Error(responseMessage || translations.login.error);
            }

            const token = data.token || (typeof data === 'string' ? data : text);

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('sea-token', token);
            storage.setItem('role', isAdmin ? 'admin' : 'student');

            navigate(isAdmin ? '/admin' : '/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL_RAW}/admin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, code: verificationCode })
            });

            const text = await response.text();

            if (!response.ok) {
                let errorMessage = 'Verification failed';
                try {
                    const data = JSON.parse(text);
                    errorMessage = data.message || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Retry login after successful verification
            await handleSubmit(null);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <Col md={6} lg={5}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Card.Body className="p-5">
                            <h2 className="text-center fw-bold text-primary mb-4">
                                {isVerifying 
                                    ? 'Verify Account' 
                                    : (isAdmin ? `${translations.login.title} (Admin)` : translations.login.title)
                                }
                            </h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            {isVerifying ? (
                                <Form onSubmit={handleVerify}>
                                    <p className="text-muted text-center mb-4">
                                        Please enter the verification code sent to your email/phone.
                                    </p>
                                    <Form.Group className="mb-4" controlId="formVerificationCode">
                                        <Form.Label>Verification Code</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter code" 
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            required 
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify'}
                                    </Button>
                                    <div className="text-center mt-3">
                                        <Button variant="link" className="text-decoration-none" onClick={sendVerificationCode}>Resend Code</Button>
                                    </div>
                                </Form>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>{translations.login.username}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder={translations.login.username} 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>{translations.login.password}</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder={translations.login.password} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <Form.Check 
                                        type="checkbox" 
                                        label={translations.login.remember} 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />

                                    {!isAdmin && (
                                        <Link to="/forgot-password" className="text-decoration-none text-primary small fw-bold">{translations.login.forgotPassword}</Link>
                                    )}
                                </div>

                                <Form.Group className="mb-4">
                                    <Form.Check 
                                        type="switch"
                                        id="admin-switch"
                                        label="Login as Administrator"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                        className="text-muted"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
                                    {loading ? translations.login.loading : translations.login.login}
                                </Button>
                            </Form>
                            )}

                            {!isAdmin && !isVerifying && (
                                <div className="text-center mt-4 text-muted">
                                    {translations.login.dontHaveAccount} <Link to="/register" className="text-primary fw-bold text-decoration-none">{translations.login.register}</Link>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;