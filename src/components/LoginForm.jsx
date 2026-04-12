import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {useLanguage} from "../context/LanguageContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";


const LoginForm = () => {
    const { translations } = useLanguage();
    const navigate = useNavigate();
    const { login, sendCode, verifyCode, loading } = useAuth();

    // const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    // const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    // const [isAdmin, setIsAdmin] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [pendingUserId, setPendingUserId] = useState(null);
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
        console.log("cont4", pendingUserId, );
        
        if (resendTimer > 0 || !pendingUserId) return;
            setResendTimer(60);
        try {
            await sendCode(pendingUserId);
        } catch (err) {
            setError('Failed to send verification code.');
            setResendTimer(0);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        const result = await login({ username, password, rememberMe });

        if (result.success) {
            navigate('/admin');
        } else if (result.status === 'verification_needed') {
            setPendingUserId(result.user_id);
            setIsVerifying(true);
                console.log("cont2", result);
            if (result.user_id) {
                console.log("cont3", result.user_id);
                setResendTimer(60);
                try {
                    await sendCode(result.user_id);
                } catch {}

                // await handleSendCode();
            }
        } else {
            setError(result.message);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        try {
            console.log("ver", { user_id: pendingUserId, code: verificationCode });
            
            await verifyCode({ user_id: pendingUserId, code: verificationCode });
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
                                    : translations.login.title
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
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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

                                    {/* {!isAdmin && (
                                        <Link to="/forgot-password" className="text-decoration-none text-primary small fw-bold">{translations.login.forgotPassword}</Link>
                                    )} */}
                                </div>

                                {/* <Form.Group className="mb-4">
                                    <Form.Check 
                                        type="switch"
                                        id="admin-switch"
                                        label="Login as Administrator"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                        className="text-muted"
                                        disabled
                                    />
                                </Form.Group> */}

                                <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
                                    {loading ? translations.login.loading : translations.login.login}
                                </Button>
                            </Form>
                            )}

                            {!isVerifying && (
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