import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import TextField from '../../components/FormFields/TextField';
import MCField from '../../components/FormFields/mcField';


const ApplicationForm = ({ schema }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  
  const handleInputChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submission = {
      id: Date.now(),
      formId: schema.id,
      studentData: answers, // دي الداتا اللي الجدول بيدور فيها
      submittedAt: new Date().toLocaleString()
    };

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
                // نمرر القيمة الراجعة من الـ Atom للـ state
                onChange={(val) => handleInputChange(field.id, val)} 
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
                // ربط الـ MCField بالـ ID
                onChange={(val) => handleInputChange(field.id, val)} 
              />
            )}
            
            {/* كرري نفس المنطق للـ FileField والـ DateField */}
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