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
     
    // --- NEW SECURITY LOGIC ---
    const now = new Date();
    const closeDate = new Date(found.closeDate);

    if (now > closeDate) {
      alert("This form is now closed and no longer accepting submissions.");
      navigate('/forms'); // Kick them back to the gallery
      return;
    }
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

  // Inside ApplicationView.jsx, the return section:
// ApplicationView.jsx
return (
  <div className="bg-light min-vh-100"> 
    {/* Only the back button stays outside if you want, or put it inside */}
    <Container className="pt-4 text-start">
      <Button variant="link" onClick={() => navigate(-1)} className="p-0 mb-2">
        &larr; Back
      </Button>
    </Container>

    {/* The Form handles the Title and Description inside the white box */}
    <ApplicationForm schema={targetForm} />
  </div>
);
};

export default ApplicationView;