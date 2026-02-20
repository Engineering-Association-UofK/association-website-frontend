import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import TextField from '../../components/FormFields/TextField';
import MCField from '../../components/FormFields/mcField';
import FileField from '../../components/FormFields/FileField'; 
import DateField from '../../components/FormFields/Datefield';

// 1. IMPORT YOUR ASSETS
// Make sure these filenames match exactly what is in your src/assets folder
import AssociationLogo from '../../assets/OIP.webp';
import bgImage from '../../assets/OIP.webp'; 

const ApplicationForm = ({ schema }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const handleInputChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check validation
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    const submission = {
      id: Date.now(),
      formId: schema.id,
      studentData: answers, 
      submittedAt: new Date().toLocaleString()
    };

    const existing = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    localStorage.setItem('allSubmissions', JSON.stringify([submission, ...existing]));
    
    alert("🎉 Submitted successfully!");
    navigate('/forms');
  };

  return (
    /* MAIN WRAPPER WITH BACKGROUND */
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '40px 20px',
      overflow: 'hidden'
    }}>
      
      {/* THE BLURRED BACKGROUND LAYER */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(30px)', // Fixed blur value here
        transform: 'scale(1.1)', 
        zIndex: -1
      }}></div>

      {/* THE CONTENT CONTAINER */}
      <div style={{ width: '100%', maxWidth: '750px', zIndex: 1 }}>
        
        {/* Header Section with Circular Logo */}
        <Card className="border-0 shadow-lg p-4 mb-4 text-center" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '20px' 
        }}>
          <div className="d-flex flex-column align-items-center">
            {/* THE CIRCULAR LOGO CONTAINER */}
            <div style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '4px solid #f8fcff', 
                marginBottom: '20px',
                overflow: 'hidden',
                padding: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <Image 
                  src={AssociationLogo} 
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                  alt="Association Logo"
                />
            </div>

            <h2 className="fw-bold text-primary">{schema.title}</h2>
            {schema.description && (
              <p className="text-muted mt-2 mb-0" style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '1.05rem',
                lineHeight: '1.6' 
              }}>
                {schema.description }
              </p>
            
            )}
          </div>
        </Card>

        {/* Questions Card */}
        <Card className="border-0 shadow-lg p-4 p-md-5 text-start" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '20px' 
        }}>
          <Form onSubmit={handleSubmit}>
            {schema.fields.map((field) => (
              <div key={field.id} className="mb-4">
                {/* Text Fields */}
                {field.type === 'text' && (
                  <TextField 
                    label={field.label} 
                    type={field.subType} 
                    isRequired={field.isRequired}
                    onChange={(val) => handleInputChange(field.id, val)} 
                  />
                )}

                {/* Number Fields */}
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

                {/* Choice / Radio Fields */}
                {field.type === 'choice' && (
                  <MCField 
                    label={field.label} 
                    options={field.options} 
                    name={`q-${field.id}`}
                    isRequired={field.isRequired}
                    onChange={(val) => handleInputChange(field.id, val)} 
                  />
                )}

                {/* Date Selection */}
                {field.type === 'date' && (
                  <Form.Group>
                    <Form.Label className="fw-bold">{field.label} {field.isRequired && "*"}</Form.Label>
                    <Form.Control 
                      type="date" 
                      required={field.isRequired} 
                      onChange={(e) => handleInputChange(field.id, e.target.value)} 
                    />
                  </Form.Group>
                )}

                {/* File Upload */}
                {field.type === 'file' && (
                  <Form.Group>
                    <Form.Label className="fw-bold">{field.label} {field.isRequired && "*"}</Form.Label>
                    <Form.Control 
                      type="file" 
                      required={field.isRequired} 
                      onChange={(e) => handleInputChange(field.id, e.target.files[0]?.name)} 
                    />
                  </Form.Group>
                )}
              </div>
            ))}

            <div className="d-grid gap-2 mt-5">
              <Button variant="primary" size="lg" type="submit" className="fw-bold" style={{ borderRadius: '10px' }}>
                Submit Application
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;