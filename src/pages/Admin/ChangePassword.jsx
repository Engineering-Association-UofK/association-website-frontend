import React, { useState } from 'react'
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const { changePassword, changePasswordLoading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("New password cannot be less than 8 characters.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (formData.oldPassword === formData.newPassword) {
            setError("New password cannot be the same as the old password.");
            return;
        }

        const result = await changePassword({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
        });

        if (result.success) {
            setSuccessMessage(result.message);
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            // setTimeout(() => navigate('/admin'), 2000);
        } else {
            setError(result.message);
        }
    };


  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Change Password</h4>
        </div>

        <div className="d-flex justify-content-center">
            <Card className="shadow-sm" style={{ width: '100%' }}>
                <Card.Body className="p-4">
                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                    {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="oldPassword"
                                placeholder="Enter current password"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                disabled={changePasswordLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                disabled={changePasswordLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={changePasswordLoading}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center">
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => navigate(-1)}
                                disabled={changePasswordLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={changePasswordLoading}
                            >
                                {changePasswordLoading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Updating...
                                    </>
                                ) : 'Update Password'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </>
  )
}

export default ChangePassword