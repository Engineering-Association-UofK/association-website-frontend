import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRegistration } from '../../features/auth/hooks/useRegistration';

const InitialRegister = () => {
  const { submitInitial, loading, error } = useRegistration();
  const [formData, setFormData] = useState({ userId: '', passcode: '', email: '' });
  const [successSent, setSuccessSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitInitial(formData);
      setSuccessSent(true);
    } catch (err) {
      // Error is handled in hook
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-75 py-5">
      <Card style={{ maxWidth: '480px', width: '100%' }} className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-2">
              <i className="bi bi-person-plus-fill fs-3"></i>
            </div>
            <h4 className="fw-bold mb-1">Student Registration</h4>
            <p className="text-muted small">Enter your credentials to begin account activation</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {successSent ? (
            <Alert variant="success" className="text-center">
              <i className="bi bi-envelope-check-fill fs-2 d-block mb-2"></i>
              <h6 className="fw-bold">Verification Email Sent!</h6>
              <p className="small mb-0">
                We have sent a completion link to <strong>{formData.email}</strong>. Please check your inbox to proceed to the next step.
              </p>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">User ID / Student Number</Form.Label>
                <Form.Control
                  type="number"
                  name="userId"
                  placeholder="e.g. 123456"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Passcode</Form.Label>
                <Form.Control
                  type="password"
                  name="passcode"
                  placeholder="Enter passcode provided by admin"
                  value={formData.passcode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 fw-medium" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Continue'}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InitialRegister;