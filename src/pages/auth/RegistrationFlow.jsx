import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useRegistration } from '../../features/auth/hooks/useRegistration';

const DEPARTMENTS = [
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'electrical', label: 'Electrical Engineering' },
  { value: 'chemical', label: 'Chemical Engineering' },
  { value: 'petroleum', label: 'Petroleum Engineering' },
  { value: 'agricultural', label: 'Agricultural Engineering' },
  { value: 'mining', label: 'Mining Engineering' },
  { value: 'surveying', label: 'Surveying Engineering' },
];

const RegistrationFlow = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const {
    checkState,
    submitPassword,
    submitDetails,
    submitUsername,
    loading,
    error,
    currentStep,
  } = useRegistration();

  // Local Form States
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [detailsData, setDetailsData] = useState({
    nameAr: '',
    nameEn: '',
    gender: 'male',
    uniId: '',
    department: 'mechanical',
    phone: '',
  });
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (code) {
      checkState(code);
    }
  }, [code, checkState]);

  // Handlers for step submissions
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    await submitPassword(code, currentStep, passwordData.password, passwordData.confirmPassword);
    checkState(code); // Advance to next step state
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    await submitDetails(code, detailsData);
    checkState(code);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    await submitUsername(code, username);
    checkState(code);
  };

  if (loading && currentStep === null) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-75">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-75 py-5">
      <Card style={{ maxWidth: '520px', width: '100%' }} className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {/* STEP 1 or STEP 5: Password Form */}
          {(currentStep === 1 || currentStep === 5) && (
            <>
              <div className="text-center mb-4">
                <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-2">
                  <i className="bi bi-shield-lock-fill fs-3"></i>
                </div>
                <h4 className="fw-bold mb-1">
                  {currentStep === 5 ? 'Reset Your Password' : 'Create Password'}
                </h4>
                <p className="text-muted small">
                  {currentStep === 5
                    ? 'Enter a new password to reset access to your account'
                    : 'Set up a password for your new account'}
                </p>
              </div>

              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="8 - 32 characters"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 fw-medium" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Save & Continue'}
                </Button>
              </Form>
            </>
          )}

          {/* STEP 2: Details Form */}
          {currentStep === 2 && (
            <>
              <div className="text-center mb-4">
                <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-2">
                  <i className="bi bi-person-vcard-fill fs-3"></i>
                </div>
                <h4 className="fw-bold mb-1">Personal Details</h4>
                <p className="text-muted small">Provide your personal and university information</p>
              </div>

              <Form onSubmit={handleDetailsSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Arabic Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={detailsData.nameAr}
                        onChange={(e) => setDetailsData({ ...detailsData, nameAr: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">English Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={detailsData.nameEn}
                        onChange={(e) => setDetailsData({ ...detailsData, nameEn: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">University ID</Form.Label>
                      <Form.Control
                        type="number"
                        value={detailsData.uniId}
                        onChange={(e) => setDetailsData({ ...detailsData, uniId: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Gender</Form.Label>
                      <Form.Select
                        value={detailsData.gender}
                        onChange={(e) => setDetailsData({ ...detailsData, gender: e.target.value })}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Department</Form.Label>
                  <Form.Select
                    value={detailsData.department}
                    onChange={(e) => setDetailsData({ ...detailsData, department: e.target.value })}
                    required
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={detailsData.phone}
                    onChange={(e) => setDetailsData({ ...detailsData, phone: e.target.value })}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 fw-medium" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Save & Continue'}
                </Button>
              </Form>
            </>
          )}

          {/* STEP 3: Username Form */}
          {currentStep === 3 && (
            <>
              <div className="text-center mb-4">
                <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-2">
                  <i className="bi bi-at fs-3"></i>
                </div>
                <h4 className="fw-bold mb-1">Choose Username</h4>
                <p className="text-muted small">Select a unique handle to complete registration</p>
              </div>

              <Form onSubmit={handleUsernameSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 fw-medium" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Finish Registration'}
                </Button>
              </Form>
            </>
          )}

          {/* STEP 4: Completed State */}
          {currentStep === 4 && (
            <div className="text-center py-3">
              <div className="bg-success-subtle text-success d-inline-flex p-3 rounded-circle mb-3">
                <i className="bi bi-check-circle-fill fs-1"></i>
              </div>
              <h4 className="fw-bold mb-2">Registration Complete!</h4>
              <p className="text-muted small mb-4">
                Your profile is active and verified. You can now log into your account.
              </p>
              <Button variant="primary" className="w-100 fw-medium" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegistrationFlow;