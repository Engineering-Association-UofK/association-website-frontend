import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import FormCard from './formcard'; // Ensure path is correct

const AnalysisGallery = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');

    // Map forms to include submission counts
    const formsWithCounts = allForms.map(f => ({
      ...f,
      submissionCount: allSubmissions.filter(s => s.formId.toString() === f.id.toString()).length
    }));
    setForms(formsWithCounts);
  }, []);

  return (
    <Container className="py-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="text-primary fw-bold">Active Forms Analysis</h2>
        <Button variant="outline-primary" onClick={() => navigate('/admin/forms')}>
          Back to Dashboard
        </Button>
      </div>

      <Row className="g-4">
        {forms.map(form => (
          <Col key={form.id} md={6} lg={4}>
            <FormCard 
              title={form.title}
              available={form.submissionCount} 
              status={form.status === 'published' ? 'Active' : 'Draft'}
              description="Review student responses and statistical data for this form."
              btnLabel="View Detailed Analysis"
              onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
              showDeadline={false}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AnalysisGallery;