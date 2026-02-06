import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';

const TextField = ({ label, type, isRequired, onChange }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Validation Logic (Error Catching)
  const validate = (input) => {
    let errorMessage = '';
    
    if (isRequired && !input) {
      errorMessage = 'This field is required.';
    } else {
      switch (type) {
        case 'email': // Type 1
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input)) errorMessage = 'Invalid email format.';
          break;
        case 'phone': // Type 4
          const phoneRegex = /^\+?[0-9]{10,14}$/;
          if (!phoneRegex.test(input)) errorMessage = 'Invalid phone number (10-14 digits).';
          break;
        case 'short': // Type 2
          if (input.length > 50) errorMessage = 'Short answer must be under 50 characters.';
          break;
        case 'long': // Type 3
          if (input.length < 10) errorMessage = 'Long answer should be at least 10 characters.';
          break;
        default:
          break;
      }
    }
    
    setError(errorMessage);
    if (onChange) onChange(input, errorMessage === '');
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    validate(val);
  };

  return (
    <Form.Group className="mb-3 text-start">
      <Form.Label className="fw-bold">
        {label} {isRequired && <span className="text-danger">*</span>}
      </Form.Label>

      {type === 'long' ? (
        <Form.Control 
          as="textarea" 
          rows={3} 
          isInvalid={!!error}
          value={value}
          onChange={handleChange}
          placeholder="Enter long answer..."
        />
      ) : (
        <Form.Control 
          type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
          isInvalid={!!error}
          value={value}
          onChange={handleChange}
          placeholder={`Enter ${type}...`}
        />
      )}

      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextField;