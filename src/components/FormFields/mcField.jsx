import React from 'react';
import { Form } from 'react-bootstrap';

const MCField = ({ label, options, isRequired, name, onChange }) => {
  return (
    <Form.Group className="mb-3 text-start">
      <Form.Label className="fw-bold">
        {label || "Select an option"} {isRequired && <span className="text-danger">*</span>}
      </Form.Label>
      
      {options && options.length > 0 ? (
        options.map((opt, index) => (
          <Form.Check 
            key={index}
            type="radio"
            label={opt}
            name={name} 
            id={`choice-${name}-${index}`}
            className="mb-1"
            
            onChange={() => onChange(opt)} 
          />
        ))
      ) : (
        <p className="text-muted small italic">No options provided.</p>
      )}
    </Form.Group>
  );
};

export default MCField;