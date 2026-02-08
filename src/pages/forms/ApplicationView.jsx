import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button } from 'react-bootstrap';
import ApplicationForm from './ApplicationForm'; // Importing the renderer

const ApplicationView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [targetForm, setTargetForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Logic: Fetch all forms from storage
    const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    
    // 2. Find the specific form by ID
    const found = allForms.find(f => f.id.toString() === formId);
    
    if (found) {
      setTargetForm(found);
    } else {
      alert("Form not found in database!");
      navigate('/forms');
    }
    setLoading(false);
  }, [formId, navigate]);

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container className="py-5">
      <div className="mb-4 text-start">
        <Button variant="link" onClick={() => navigate(-1)} className="p-0 mb-2">
          &larr; Back
        </Button>
        <h2 className="fw-bold text-primary">{targetForm.title}</h2>
        <p className="text-muted">Fill out the requirements below to apply.</p>
        <hr />
      </div>

      {/* CALLING THE RENDERER COMPONENT */}
      <ApplicationForm schema={targetForm} />
    </Container>
  );
};

export default ApplicationView;