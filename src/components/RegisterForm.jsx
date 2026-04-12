import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {useAuth} from "../context/AuthContext.jsx";

const DEPARTMENTS = [
  { value: 'surveying', label: 'Surveying Engineering' },
  { value: 'agricultural', label: 'Agricultural Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'electrical', label: 'Electrical and Electronics Engineering' },
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'mining', label: 'Mining Engineering' },
  { value: 'chemical', label: 'Chemical Engineering' },
  { value: 'petroleum', label: 'Petroleum Engineering' },
];
 
const INITIAL_FORM = {
  user_id: '',        // Student index number (e.g. 195011) — provided by university
  uni_id: '',         // University / national ID number
  username: '',       // Chosen by student
  name_en: '',        // Full name in English
  name_ar: '',        // Full name in Arabic
  email: '',
  phone: '',
  passcode: '',       // Pre-given 4-digit passcode from the university
  password: '',
  confirm_password: '',
  gender: '',
  department: '',
};

const RegisterForm = () => {
    const { translations } = useLanguage();
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log("ssss", formData);
        

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        const result = await register({
            user_id: Number(formData.user_id),    // backend expects integer
            uni_id: Number(formData.uni_id),
            username: formData.username,
            name_en: formData.name_en,
            name_ar: formData.name_ar,
            email: formData.email,
            phone: formData.phone,
            passcode: formData.passcode,
            password: formData.password,
            confirm_password: formData.confirm_password,
            gender: formData.gender,
            department: formData.department,
        });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }

        // try {
        //     const response = await fetch('/api/register', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             username: formData.username,
        //             email: formData.email,
        //             password: formData.password
        //         }),
        //     });

        //     if (!response.ok) {
        //         const data = await response.json();
        //         throw new Error(data.message || 'Registration failed');
        //     }

        //     // Redirect to login page upon successful registration
        //     navigate('/login');
        // } catch (err) {
        //     setError(err.message);
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        // <Container className="py-5">
        //     <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        //         <Col md={6} lg={5}>
        //             <Card className="shadow-lg border-0 rounded-4">
        //                 <Card.Body className="p-5">
        //                     <h2 className="text-center fw-bold text-primary mb-4">{translations.register.title}</h2>
        //                     {error && <Alert variant="danger">{error}</Alert>}
        //                     <Form onSubmit={handleSubmit}>
        //                         <Form.Group className="mb-3" controlId="formUsername">
        //                             <Form.Label>{translations.register.username}</Form.Label>
        //                             <Form.Control type="text" name="username" placeholder={translations.register.username} value={formData.username} onChange={handleChange} required />
        //                         </Form.Group>
        //                         <Form.Group className="mb-3" controlId="formEmail">
        //                             <Form.Label>{translations.register.email}</Form.Label>
        //                             <Form.Control type="email" name="email" placeholder={translations.register.emailExample} value={formData.email} onChange={handleChange} required />
        //                         </Form.Group>
        //                         <Form.Group className="mb-3" controlId="formPassword">
        //                             <Form.Label>{translations.register.password}</Form.Label>
        //                             <Form.Control type="password" name="password" placeholder={translations.register.password} value={formData.password} onChange={handleChange} required />
        //                         </Form.Group>
        //                         <Form.Group className="mb-4" controlId="formConfirmPassword">
        //                             <Form.Label>{translations.register.confirmPassword}</Form.Label>
        //                             <Form.Control type="password" name="confirmPassword" placeholder={translations.register.confirmPassword} value={formData.confirmPassword} onChange={handleChange} required />
        //                         </Form.Group>
        //                         <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
        //                             {loading ? translations.register.loading : translations.register.register}
        //                         </Button>
        //                     </Form>
        //                     <div className="text-center mt-4 text-muted">
        //                         {translations.register.haveAccount} <Link to="/login" className="text-primary fw-bold text-decoration-none">{translations.register.login}</Link>
        //                     </div>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //     </Row>
        // </Container>
        <Container className="py-5">
      <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Col md={8} lg={7}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <h2 className="text-center fw-bold text-primary mb-4">
                {translations.register.title}
              </h2>
 
              {error && <Alert variant="danger">{error}</Alert>}
 
              <Form onSubmit={handleSubmit}>
                {/* ── University Credentials ──────────────────────────── */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formUserId">
                      <Form.Label>Student Index Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="user_id"
                        placeholder="e.g. 123456"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Your university student index.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formUniId">
                      <Form.Label>University ID</Form.Label>
                      <Form.Control
                        type="number"
                        name="uni_id"
                        placeholder="e.g. 1234567891234"
                        value={formData.uni_id}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
 
                <Form.Group className="mb-3" controlId="formPasscode">
                  <Form.Label>Passcode</Form.Label>
                  <Form.Control
                    type="text"
                    name="passcode"
                    placeholder="Passcode"
                    value={formData.passcode}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    The passcode you received from the Steering Engineering Association.
                  </Form.Text>
                </Form.Group>
 
                {/* ── Personal Information ────────────────────────────── */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNameEn">
                      <Form.Label>Full Name (English)</Form.Label>
                      <Form.Control
                        type="text"
                        name="name_en"
                        placeholder="Full name in English"
                        value={formData.name_en}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNameAr">
                      <Form.Label>الاسم الكامل (عربي)</Form.Label>
                      <Form.Control
                        type="text"
                        name="name_ar"
                        placeholder="الاسم بالعربية"
                        value={formData.name_ar}
                        onChange={handleChange}
                        dir="rtl"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
 
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formGender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formDepartment">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
 
                {/* ── Account Details ─────────────────────────────────── */}
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>{translations.register.username}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder={translations.register.username}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
 
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>{translations.register.email}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder={translations.register.emailExample}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
 
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="e.g. 0912345678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
 
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>{translations.register.password}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder={translations.register.password}
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                      <Form.Label>{translations.register.confirmPassword}</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm_password"
                        placeholder={translations.register.confirmPassword}
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
 
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill py-2 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? translations.register.loading : translations.register.register}
                </Button>
              </Form>
 
              <div className="text-center mt-4 text-muted">
                {translations.register.haveAccount}{' '}
                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                  {translations.register.login}
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    );
};

export default RegisterForm;