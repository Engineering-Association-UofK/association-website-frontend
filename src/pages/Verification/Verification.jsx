import React, { useState } from 'react';
import CertificateVerification from '../../components/CertificateVerification/CertificateVerification';
import { Container, Form, Button } from 'react-bootstrap';

const Verification = () => {
    // State to simulate searching for a certificate
    const [searchId, setSearchId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    // Mock Database
    const mockCertificates = {
        '123456': {
            isValid: true,
            issuedTo: 'Ahmed Mutassim',
            event: 'Machine Learning Workshop',
            issueDate: 'January 29, 2026',
            studentId: '123556',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Cert-123456'
        },
        'invalid': {
            isValid: false
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        // Simple logic for demo: if ID exists in mock DB, show it. If "invalid", show invalid. Else, null.
        if (mockCertificates[searchId]) {
            setVerificationResult(mockCertificates[searchId]);
        } else {
            // Treat unknown IDs as invalid for demo, or just null
            setVerificationResult({ isValid: false });
        }
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Certificate verification</h1>

            <div style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
                <Form onSubmit={handleVerify}>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter Certificate ID (Try "123456" for valid, any other for invalid)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Certificate ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Verify
                    </Button>
                </Form>
            </div>

            {verificationResult && (
                <div className="mt-4">
                    <CertificateVerification
                        isValid={verificationResult.isValid}
                        issuedTo={verificationResult.issuedTo}
                        event={verificationResult.event}
                        issueDate={verificationResult.issueDate}
                        studentId={verificationResult.studentId}
                        qrCodeUrl={verificationResult.qrCodeUrl}
                    />
                </div>
            )}
        </Container>
    );
};

export default Verification;
