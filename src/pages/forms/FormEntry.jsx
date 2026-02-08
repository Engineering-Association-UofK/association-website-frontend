import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Import all Atoms (Atoms are your UI building blocks)
import TextField from '../../components/FormFields/TextField'; 
import FileField from '../../components/FormFields/FileField'; 
import MCField from '../../components/FormFields/mcField';
import DateField from '../../components/FormFields/Datefield';

const FormEntry = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState('');
  const [category, setCategory] = useState('competitions');
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const addField = (fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      subType: 'short',
      label: '',
      isRequired: false,
      options: fieldType === 'choice' ? ['Option 1'] : []
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (id, key, value) => {
    setFormFields(formFields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const addOption = (fieldId) => {
    setFormFields(formFields.map(f => {
      if (f.id === fieldId) return { ...f, options: [...f.options, `Option ${f.options.length + 1}`] };
      return f;
    }));
  };

  const updateOption = (fieldId, optIdx, val) => {
    setFormFields(formFields.map(f => {
      if (f.id === fieldId) {
        const newOpts = [...f.options];
        newOpts[optIdx] = val;
        return { ...f, options: newOpts };
      }
      return f;
    }));
  };

  // --- Real Engineering Logic: Save to LocalStorage with Dates ---
  const handleSave = (status) => {
    if (!formName || !closeDate) {
      alert("Please enter a form name and a close date!");
      return;
    }

    const newFormEntry = {
      id: Date.now(),
      title: formName,
      category: category,
      status: status, // 'draft' or 'published'
      openDate: openDate, // تم الربط هنا
      closeDate: closeDate, // تم الربط هنا
      fields: formFields,
      createdAt: new Date().toLocaleDateString(),
      submissions: 0 // Initialize applicant count
    };

    const existingForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    localStorage.setItem('myCustomForms', JSON.stringify([newFormEntry, ...existingForms]));

    alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
    navigate('/admin/forms');
  };

  return (
    <Container className="py-4 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Form Builder</h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/forms')}>Back</Button>
      </div>
      
      <Card className="p-4 mb-4 shadow-sm border-0 bg-light">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Form Name</Form.Label>
              <Form.Control type="text" value={formName} onChange={(e) => setFormName(e.target.value)} />
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

      <div className="d-flex flex-wrap gap-2 mb-4">
        <Button variant="primary" onClick={() => addField('text')}>+ Text</Button>
        <Button variant="primary" onClick={() => addField('number')}>+ Number</Button>
        <Button variant="primary" onClick={() => addField('choice')}>+ Choice</Button>
        <Button variant="primary" onClick={() => addField('file')}>+ File</Button>
        <Button variant="primary" onClick={() => addField('date')}>+ Date</Button>
      </div>

      {formFields.map((field, index) => (
        <Card key={field.id} className="mb-3 p-3 border-start border-primary border-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0 text-primary">Element #{index + 1}: {field.type.toUpperCase()}</h6>
            <Button variant="outline-danger" size="sm" onClick={() => removeField(field.id)}>Delete</Button>
          </div>
          <Row className="g-3">
            <Col md={12}>
              <Form.Control type="text" placeholder="Question Label" value={field.label} onChange={(e) => updateField(field.id, 'label', e.target.value)} />
            </Col>
            {field.type === 'choice' && (
              <Col md={12} className="bg-light p-3 rounded">
                {field.options.map((opt, optIdx) => (
                  <div key={optIdx} className="d-flex gap-2 mb-2">
                    <Form.Control size="sm" value={opt} onChange={(e) => updateOption(field.id, optIdx, e.target.value)} />
                  </div>
                ))}
                <Button variant="link" size="sm" onClick={() => addOption(field.id)}>+ Add Choice</Button>
              </Col>
            )}
            <Col md={6} className="d-flex align-items-center">
              <Form.Check label="Required" checked={field.isRequired} onChange={(e) => updateField(field.id, 'isRequired', e.target.checked)} />
            </Col>
          </Row>
        </Card>
      ))}

      <div className="d-flex justify-content-end gap-3 mt-5">
        <Button variant="outline-info" onClick={() => setShowPreview(true)}>Preview</Button>
        <Button variant="outline-secondary" onClick={() => handleSave('draft')}>Save Draft</Button>
        <Button variant="success" className="px-5 fw-bold" onClick={() => handleSave('published')}>Publish</Button>
      </div>
    </Container>
  );
};

export default FormEntry;