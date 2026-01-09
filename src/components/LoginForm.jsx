import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {useLanguage} from "../context/LanguageContext.jsx";
import {CONFIG} from "../config/index.js";
import {useAuth} from "../context/AuthContext.jsx";


const LoginForm = () => {
    const { translations } = useLanguage();
    const navigate = useNavigate();
    const { login, sendCode, verifyCode, loading } = useAuth();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendCode = async () => {
        if (resendTimer > 0) return;
        setResendTimer(60);
        try {
            await sendCode(name);
        } catch (err) {
            setError('Failed to send verification code.');
            setResendTimer(0);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        const result = await login({ name, password, isAdmin, rememberMe });

        if (result.success) {
            navigate(isAdmin ? '/admin' : '/');
        } else if (result.status === 'verification_needed') {
            setIsVerifying(true);
            await handleSendCode();
        } else {
            setError(result.message);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await verifyCode({ name, code: verificationCode });
            // If verify works, try logging in again automatically
            await handleSubmit(null); 
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
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
                                        <Button 
                                            variant="link" 
                                            className="text-decoration-none" 
                                            onClick={handleSendCode}
                                            disabled={resendTimer > 0}
                                        >
                                            {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                                        </Button>
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