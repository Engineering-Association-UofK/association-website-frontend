import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import FormCard from './formcard'; 

const AnalysisGallery = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // 1. Fetch the data structures
    const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');

    // 2. Combine them to get accurate submission counts per form
    const formsWithCounts = allForms.map(f => {
      // Ensure we compare strings to strings
      const count = allSubmissions.filter(s => s.formId.toString() === f.id.toString()).length;
      return {
        ...f,
        submissionCount: count
      };
    });

    setForms(formsWithCounts);
  }, []);

  return (
    <Container className="py-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="text-primary fw-bold">Forms Data Analysis</h2>
          <p className="text-muted">Monitor performance and view response statistics for your dynamic forms.</p>
        </div>
        <Button variant="outline-primary" className="px-4 fw-bold" onClick={() => navigate('/admin/forms')}>
          Back to Dashboard
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <h5 className="text-muted">No forms created yet. Create a form to see analysis.</h5>
        </div>
      ) : (
        <Row className="g-4">
          {forms.map(form => (
            <Col key={form.id} md={6} lg={4}>
              <FormCard 
                title={form.title}
                available={form.submissionCount} // Showing submission count here
                status={form.status === 'published' ? 'Active' : 'Draft'}
                description={form.description || "Review student responses and statistical data for this form."}
                btnLabel="View Detailed Analysis"
                onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
                showDeadline={false}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AnalysisGallery;