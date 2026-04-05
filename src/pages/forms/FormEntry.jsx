import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm'; 

const FormEntry = () => {
  const navigate = useNavigate();
  
  const [formName, setFormName] = useState('');
  const [category, setCategory] = useState('competitions');
  const [description, setDescription] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const [pages, setPages] = useState([
    { id: Date.now(), title: 'Step 1', fields: [] }
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const addPage = () => {
    if (pages.length >= 7) return alert("Maximum 7 pages recommended for Student UX.");
    const newPage = { id: Date.now(), title: `Step ${pages.length + 1}`, fields: [] };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
  };

  const removePage = (index) => {
    if (pages.length === 1) return;
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageIndex(0);
  };

  const addField = (fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      subType: 'short', // Default for text
      label: '',
      isRequired: false,
      options: fieldType === 'choice' ? ['Option 1'] : []
    };
    const updatedPages = [...pages];
    updatedPages[activePageIndex].fields.push(newField);
    setPages(updatedPages);
  };

  const updateField = (fieldId, key, value) => {
    const updatedPages = pages.map((page, pIdx) => {
      if (pIdx === activePageIndex) {
        return {
          ...page,
          fields: page.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

  const handleSave = (status) => {
    if (!formName || !closeDate) {
      alert("Please enter a form name and a close date!");
      return;
    }
    const newFormEntry = {
      id: Date.now(), title: formName, description, category, status,
      openDate, closeDate, pages, createdAt: new Date().toLocaleDateString(), submissions: 0
    };
    const existingForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    localStorage.setItem('myCustomForms', JSON.stringify([newFormEntry, ...existingForms]));
    alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
    navigate('/admin/forms');
  };

  return (
    <Container className="py-4 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary">Multi-Page Form Builder</h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/forms')}>Back</Button>
      </div>

      <Card className="p-4 mb-4 shadow-sm border-0 bg-white">
        <Row className="g-3">
          <Col md={6}><Form.Label className="fw-bold">Form Name</Form.Label><Form.Control value={formName} onChange={(e) => setFormName(e.target.value)} /></Col>
          <Col md={6}><Form.Label className="fw-bold">Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="competitions">Competitions</option>
              <option value="positions">Apply for Position</option>
              <option value="workshops">Workshops</option>
            </Form.Select>
          </Col>
          <Col md={12}><Form.Label className="fw-bold">Description</Form.Label><Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></Col>
          <Col md={6}><Form.Label className="fw-bold text-success">Open Date</Form.Label><Form.Control type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} /></Col>
          <Col md={6}><Form.Label className="fw-bold text-danger">Close Date</Form.Label><Form.Control type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} /></Col>
        </Row>
      </Card>

      <div className="d-flex gap-2 mb-4 overflow-auto pb-2 border-bottom">
        {pages.map((page, index) => (
          <div key={page.id} className="position-relative">
            <Button variant={activePageIndex === index ? "primary" : "outline-primary"} onClick={() => setActivePageIndex(index)} className="px-4 fw-bold">Step {index + 1}</Button>
            {pages.length > 1 && (
              <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-circle" style={{ cursor: 'pointer', zIndex: 10 }} onClick={(e) => { e.stopPropagation(); removePage(index); }}>&times;</Badge>
            )}
          </div>
        ))}
        <Button variant="success" onClick={addPage} className="fw-bold">+</Button>
      </div>

      <div className="bg-light p-4 rounded mb-4 border shadow-sm">
        <Form.Control className="form-control-lg fw-bold mb-4" value={pages[activePageIndex].title} onChange={(e) => {
          const updated = [...pages]; updated[activePageIndex].title = e.target.value; setPages(updated);
        }} />

        <div className="d-flex flex-wrap gap-2 mb-4">
          <Button variant="outline-primary" size="sm" onClick={() => addField('text')}>+ Text</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('number')}>+ Number</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('choice')}>+ Choice</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('file')}>+ File</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('date')}>+ Date</Button>
        </div>

        {pages[activePageIndex].fields.map((field, index) => (
          <Card key={field.id} className="mb-3 p-3 border-start border-primary border-4 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
               <h6 className="m-0 text-primary small fw-bold">Element #{index + 1}: {field.type.toUpperCase()}</h6>
               <Button variant="link" className="text-danger p-0" onClick={() => {
                 const updated = [...pages]; updated[activePageIndex].fields = updated[activePageIndex].fields.filter(f => f.id !== field.id); setPages(updated);
               }}>Delete</Button>
            </div>
            <Form.Control className="mb-2" placeholder="Question Label" value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)} />
            
            {field.type === 'text' && (
              <Form.Select size="sm" className="mb-2" value={field.subType} onChange={e => updateField(field.id, 'subType', e.target.value)}>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </Form.Select>
            )}

            {field.type === 'choice' && (
              <div className="bg-white p-2 rounded border mb-2">
                {field.options.map((opt, oIdx) => (
                  <Form.Control key={oIdx} size="sm" className="mb-1" value={opt} onChange={e => {
                    const updated = [...pages]; updated[activePageIndex].fields.find(f => f.id === field.id).options[oIdx] = e.target.value; setPages(updated);
                  }} />
                ))}
                <Button variant="link" size="sm" onClick={() => {
                  const updated = [...pages]; updated[activePageIndex].fields.find(f => f.id === field.id).options.push(`Option ${field.options.length + 1}`); setPages(updated);
                }}>+ Add Choice</Button>
              </div>
            )}
            <Form.Check type="checkbox" label="Required" checked={field.isRequired} onChange={e => updateField(field.id, 'isRequired', e.target.checked)} />
          </Card>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-3 mt-5">
        <Button variant="outline-info" onClick={() => setShowPreview(true)}>Preview</Button>
        <Button variant="outline-secondary" onClick={() => handleSave('draft')}>Save Draft</Button>
        <Button variant="success" className="px-5 fw-bold" onClick={() => handleSave('published')}>Publish</Button>
      </div>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Live Preview</Modal.Title></Modal.Header>
        <Modal.Body className="bg-light p-0">
          <ApplicationForm schema={{ id: 'preview', title: formName, description, pages }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FormEntry;