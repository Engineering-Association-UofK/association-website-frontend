import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const FormsDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-5">
        <h4 className='table-title'>Forms Management</h4>
      </div>

      <Row className="gap-4 justify-content-center">
        {/* Option 1: Create New Form */}
        <Col md={5} 
             className="p-5 text-center shadow-sm rounded bg-white" 
             style={{ cursor: 'pointer', border: '1px solid #eee', transition: '0.3s' }}
             onClick={() => navigate('/admin/forms/create')}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="mb-3">
            <i className="bi bi-plus-circle" style={{ fontSize: '3rem', color: '#004a99' }}></i>
          </div>
          <h5 style={{ color: '#004a99' }}>Create New Form</h5>
          <p className="text-muted small">Design a new dynamic form with custom fields.</p>
        </Col>

        {/* Option 2: Active Forms Analysis */}
        <Col md={5} 
             className="p-5 text-center shadow-sm rounded bg-white" 
             style={{ cursor: 'pointer', border: '1px solid #eee', transition: '0.3s' }}
             onClick={() => navigate('/admin/forms/analysis')}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="mb-3">
            <i className="bi bi-graph-up-arrow" style={{ fontSize: '3rem', color: '#166534' }}></i>
          </div>
          <h5 style={{ color: '#166534' }}>Active Forms Analysis</h5>
          <p className="text-muted small">View submissions and response statistics.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default FormsDashboard;