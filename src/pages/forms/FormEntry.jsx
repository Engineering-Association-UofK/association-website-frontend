import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
// Ensure the path to your TextField atom is correct
import TextField from '../../components/FormFields/TextField'; 

const FormEntry = () => {
  const [formName, setFormName] = useState('');
  const [category, setCategory] = useState('competitions');
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [formFields, setFormFields] = useState([]);

  // --- Preview State ---
  const [showPreview, setShowPreview] = useState(false);

  const addField = (fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      subType: 'short',
      label: '',
      isRequired: false,
      options: ['Option 1'] // Default option for choices
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (id, key, value) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const handleSave = () => {
    const formData = { formName, category, openDate, closeDate, fields: formFields };
    console.log("Saving Form Structure:", formData);
    alert("Form structure saved to console!");
  };

  return (
    <Container className="py-4 text-start">
      <h4 className="mb-4">Form Builder Dashboard</h4>
      
      {/* SECTION 1: FORM META DATA */}
      <Card className="p-4 mb-4 shadow-sm border-0 bg-light">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Form Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g., Annual Robotics Competition"
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="competitions">Competitions</option>
                <option value="positions">Apply for Position</option>
                <option value="workshops">Workshops</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Open Date</Form.Label>
              <Form.Control type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Close Date</Form.Label>
              <Form.Control type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* SECTION 2: FIELD ADDER */}
      <h5 className="mb-3">Add Form Elements</h5>
      <div className="d-flex gap-2 mb-4">
        <Button variant="primary" onClick={() => addField('text')}>+ Text Input</Button>
        <Button variant="primary" onClick={() => addField('number')}>+ Number Input</Button>
        <Button variant="primary" onClick={() => addField('choice')}>+ Multiple Choice</Button>
      </div>

      {/* SECTION 3: FIELD LIST */}
      {formFields.map((field, index) => (
        <Card key={field.id} className="mb-3 p-3 border-start border-primary border-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0 text-primary">Element #{index + 1}: {field.type.toUpperCase()}</h6>
            <Button variant="outline-danger" size="sm" onClick={() => removeField(field.id)}>Delete</Button>
          </div>
          <Row className="g-3">
            <Col md={12}>
              <Form.Control 
                type="text" 
                placeholder="Enter Question/Label"
                value={field.label}
                onChange={(e) => updateField(field.id, 'label', e.target.value)}
              />
            </Col>
            {field.type === 'text' && (
              <Col md={6}>
                <Form.Select value={field.subType} onChange={(e) => updateField(field.id, 'subType', e.target.value)}>
                  <option value="short">Short Answer</option>
                  <option value="long">Long Answer</option>
                  <option value="email">Email Address</option>
                  <option value="phone">Phone Number</option>
                </Form.Select>
              </Col>
            )}
            <Col md={6} className="d-flex align-items-center">
              <Form.Check label="Required" checked={field.isRequired} onChange={(e) => updateField(field.id, 'isRequired', e.target.checked)} />
            </Col>
          </Row>
        </Card>
      ))}

      <hr className="my-5" />
      <div className="d-flex justify-content-end gap-3">
        <Button variant="outline-secondary" size="lg" onClick={() => setShowPreview(true)}>
          Preview Design
        </Button>
        <Button variant="success" size="lg" className="px-5 fw-bold" onClick={handleSave}>
          Save and Publish
        </Button>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Student View Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light p-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-primary mb-1">{formName || "Untitled Form"}</h2>
            <p className="text-muted small mb-4">Category: {category}</p>
            <hr />
            {formFields.length === 0 ? (
              <p className="text-center py-4">No fields added yet.</p>
            ) : (
              formFields.map((field) => (
                <div key={field.id} className="mb-4">
                  {field.type === 'text' ? (
                    <TextField 
                      label={field.label || "Untitled Question"} 
                      type={field.subType} 
                      isRequired={field.isRequired} 
                    />
                  ) : field.type === 'number' ? (
                    <Form.Group>
                      <Form.Label className="fw-bold">{field.label || "Untitled Question"} {field.isRequired && "*"}</Form.Label>
                      <Form.Control type="number" />
                    </Form.Group>
                  ) : (
                    <Form.Group>
                      <Form.Label className="fw-bold">{field.label || "Untitled Question"}</Form.Label>
                      <div className="p-2 border rounded bg-light text-muted small">
                        Multiple choice options would appear here.
                      </div>
                    </Form.Group>
                  )}
                </div>
              ))
            )}
            <Button variant="primary" className="mt-3" disabled>Submit Application</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FormEntry;