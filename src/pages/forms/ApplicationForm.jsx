import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Import your Atoms
import TextField from '../../components/FormFields/TextField';
import FileField from '../../components/FormFields/FileField';
import MCField from '../../components/FormFields/mcField';
import DateField from '../../components/FormFields/Datefield';

const ApplicationForm = ({ schema }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const handleInputChange = (fieldId, value) => {
    setAnswers({ ...answers, [fieldId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Create the submission package
    const submission = {
      id: Date.now(),
      formId: schema.id,
      formTitle: schema.title,
      studentData: answers,
      submittedAt: new Date().toLocaleString()
    };

    // 2. Logic: Save to allSubmissions list
    const existing = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    localStorage.setItem('allSubmissions', JSON.stringify([submission, ...existing]));

    alert("🎉 Submitted successfully!");
    navigate('/forms');
  };

  return (
    <Card className="border-0 shadow-sm p-4 p-md-5 text-start">
      <Form onSubmit={handleSubmit}>
        {schema.fields.map((field) => (
          <div key={field.id} className="mb-4">
            {field.type === 'text' && (
              <TextField 
                label={field.label} 
                type={field.subType} 
                isRequired={field.isRequired}
                // Update state when student types
                onChange={(e) => handleInputChange(field.id, e.target.value)} 
              />
            )}

            {field.type === 'number' && (
              <Form.Group>
                <Form.Label className="fw-bold">{field.label} {field.isRequired && "*"}</Form.Label>
                <Form.Control 
                   type="number" 
                   required={field.isRequired}
                   onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              </Form.Group>
            )}

            {field.type === 'choice' && (
              <MCField 
                label={field.label} 
                options={field.options} 
                name={`q-${field.id}`}
                isRequired={field.isRequired}
              />
            )}

            {field.type === 'file' && (
              <FileField label={field.label} isRequired={field.isRequired} />
            )}

            {field.type === 'date' && (
              <DateField label={field.label} isRequired={field.isRequired} />
            )}
          </div>
        ))}

        <div className="d-grid gap-2 mt-5">
          <Button variant="primary" size="lg" type="submit" className="fw-bold">
            Submit Application
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ApplicationForm;