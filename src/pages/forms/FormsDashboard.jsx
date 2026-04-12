import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Badge, Button } from 'react-bootstrap';                    
import { endpoints,authFetch } from '../../config/api';

const FormsDashboard = () => {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = useState([]);

  // Fetch data from localStorage when component mounts
useEffect(() => {
  const fetchForms = async () => {
    try {
      const res = await authFetch(endpoints.forms);
      
      if (!res.ok) {
        console.error("Failed to fetch forms:", res.status);
        return;
      }

      const data = await res.json();
      console.log("Forms from backend:", data); // check what shape data is
      setSavedForms(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Could not load forms:", err);
      setSavedForms([]);
    }
  };

  fetchForms();
}, []);
 

  // Delete logic
  // const deleteForm = (id) => {
  //   if(window.confirm("Delete this form?")) {
  //     const updated = savedForms.filter(f => f.id !== id);
  //     setSavedForms(updated);
  //     localStorage.setItem('myCustomForms', JSON.stringify(updated));
  //   }
  // };
 const deleteForm = async (id) => {
  if (!window.confirm("Delete this form?")) return;
  try {
    await authFetch(`${endpoints.forms}/${id}`, { method: 'DELETE' });
    setSavedForms(prev => prev.filter(f => f.id !== id));
  } catch (err) {
    alert("Failed to delete.");
  }
};

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-5">
        <h4 className='table-title'>Forms Management</h4>
      </div>

      {/* BIG ACTION CARDS */}
      <Row className="gap-4 justify-content-center mb-5">
        <Col md={5} 
             className="p-5 text-center shadow-sm rounded bg-white" 
             style={{ cursor: 'pointer', border: '1px solid #eee', transition: '0.3s' }}
             onClick={() => navigate('/admin/forms/create')}>
          <div className="mb-3">
            <i className="bi bi-plus-circle" style={{ fontSize: '3rem', color: '#004a99' }}></i>
          </div>
          <h5 style={{ color: '#004a99' }}>Create New Form</h5>
          <p className="text-muted small">Design a new dynamic form with custom fields.</p>
        </Col>

        <Col md={5} 
             className="p-5 text-center shadow-sm rounded bg-white" 
             style={{ cursor: 'pointer', border: '1px solid #eee', transition: '0.3s' }}
             onClick={() => navigate('/admin/forms/analysis')}>
          <div className="mb-3">
            <i className="bi bi-graph-up-arrow" style={{ fontSize: '3rem', color: '#166534' }}></i>
          </div>
          <h5 style={{ color: '#166534' }}>Active Forms Analysis</h5>
          <p className="text-muted small">View submissions and response statistics.</p>
        </Col>
      </Row>

      {/* MANAGEMENT TABLE (The Real Evidence) */}
      <div className="bg-white p-4 shadow-sm rounded border">
        <h5 className="mb-4">Recent Form Activities</h5>
        <Table responsive hover borderless align="middle">
          <thead className="bg-light text-muted small text-uppercase">
            <tr>
              <th>Form Name</th>
              <th>Status</th>
              <th>Submissions</th>
              <th>Created Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedForms.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4">No forms created yet.</td></tr>
            ) : (
              // savedForms.map((form) => (
              //   <tr key={form.id}>
              //     <td className="fw-bold">{form.title}</td>
              //     <td>
              //       <Badge bg={form.status === 'published' ? 'success' : 'secondary'}>
              //         {form.status.toUpperCase()}
              //       </Badge>
              //     </td>
              //     <td>{form.submissions} Applicants</td>
              //     <td className="text-muted">{form.createdAt}</td>
              //     <td className="text-end">
              //       <Button variant="link" className="text-danger" onClick={() => deleteForm(form.id)}>
              //         <i className="bi bi-trash"></i>
              //       </Button>
              //     </td>
              //   </tr>
              // ))
              savedForms.map((form) => (
  <tr key={form.id}>
    <td className="fw-bold">{form.title}</td>
    <td>
      <Badge bg={form.is_active ? 'success' : 'secondary'}>
        {form.is_active ? 'ACTIVE' : 'INACTIVE'}
      </Badge>
    </td>
    <td>— Applicants</td>
    <td className="text-muted">{form.id}</td>
    <td className="text-end">
      <Button variant="link" className="text-danger" onClick={() => deleteForm(form.id)}>
        <i className="bi bi-trash"></i>
      </Button>
    </td>
  </tr>
))
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default FormsDashboard;