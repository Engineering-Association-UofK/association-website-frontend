import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Card, Button, Row, Col } from 'react-bootstrap';
import { 
  Chart as ChartJS, 
  ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, 
  BarElement, Title 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FormAnalysisView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  useEffect(() => {
    const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    const currentForm = allForms.find(f => f.id.toString() === id.toString());
    const currentSubmissions = allSubmissions.filter(s => s.formId.toString() === id.toString());
    setFormSchema(currentForm);
    setSubmissions(currentSubmissions);
  }, [id]);

  const handlePrint = () => {
    setActiveAnalysis('all'); 
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const renderSelectionCharts = () => {
    const choiceFields = formSchema.fields.filter(f => f.type === 'choice');
    return choiceFields.map(field => {
      const counts = {};
      submissions.forEach(sub => {
        const val = sub.studentData?.[field.id];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      const data = {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: ['#004a99', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'],
        }],
      };
      return (
        <Col md={6} key={field.id} className="mb-4">
          <Card className="p-4 border-0 shadow-sm h-100">
            <h6 className="fw-bold text-center mb-4">{field.label}</h6>
            <div style={{ height: '250px' }}><Pie data={data} options={{ maintainAspectRatio: false }} /></div>
          </Card>
        </Col>
      );
    });
  };

  const renderNumericalCharts = () => {
    const numFields = formSchema.fields.filter(f => f.type === 'number');
    return numFields.map(field => {
      const counts = {};
      submissions.forEach(sub => {
        const val = sub.studentData?.[field.id];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      const sortedLabels = Object.keys(counts).sort((a, b) => a - b);
      const data = {
        labels: sortedLabels,
        datasets: [{
          label: 'Count',
          data: sortedLabels.map(l => counts[l]),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
        }],
      };
      return (
        <Col md={12} key={field.id} className="mb-4">
          <Card className="p-4 border-0 shadow-sm">
            <h6 className="fw-bold mb-4">{field.label} Trends</h6>
            <div style={{ height: '300px' }}><Bar data={data} options={{ maintainAspectRatio: false }} /></div>
          </Card>
        </Col>
      );
    });
  };

  if (!formSchema) return <Container className="py-5 text-center">Loading Analysis...</Container>;

  return (
    <Container className="py-5 text-start print-container">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-container { width: 100% !important; margin: 0 !important; padding: 0 !important; }
            .card { border: 1px solid #eee !important; box-shadow: none !important; break-inside: avoid; }
            h2 { color: #004a99 !important; }
          }
        `}
      </style>

      <div className="d-flex justify-content-between align-items-center mb-5 no-print">
        <h2 className="text-primary fw-bold">{formSchema.title} Analysis</h2>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={handlePrint}>
            <i className="bi bi-file-earmark-pdf me-2"></i> Export Report
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/admin/forms/analysis')}>Back</Button>
        </div>
      </div>

      <div className="d-none d-print-block mb-4">
        <h1 style={{ color: '#004a99' }}>Engineering Association</h1>
        <h3>Form Report: {formSchema.title}</h3>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
        <hr />
      </div>

      <Row className="g-4 mb-5 no-print">
        <Col md={4}>
          <Card className="p-5 text-center border-0 shadow-sm h-100"
                style={{ cursor: 'pointer', backgroundColor: activeAnalysis === 'selection' ? '#f0f7ff' : 'white', border: activeAnalysis === 'selection' ? '2px solid #004a99' : 'none' }}
                onClick={() => setActiveAnalysis(activeAnalysis === 'selection' ? null : 'selection')}>
             <i className="bi bi-pie-chart text-primary mb-3" style={{ fontSize: '3rem' }}></i>
             <h5>Selection Distribution</h5>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-5 text-center border-0 shadow-sm h-100"
                style={{ cursor: 'pointer', backgroundColor: activeAnalysis === 'numerical' ? '#f0fdf4' : 'white', border: activeAnalysis === 'numerical' ? '2px solid #166534' : 'none' }}
                onClick={() => setActiveAnalysis(activeAnalysis === 'numerical' ? null : 'numerical')}>
             <i className="bi bi-bar-chart text-success mb-3" style={{ fontSize: '3rem' }}></i>
             <h5>Numerical Trends</h5>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-5 text-center border-0 shadow-sm h-100"
                style={{ cursor: 'pointer', backgroundColor: activeAnalysis === 'raw' ? '#f9fafb' : 'white', border: activeAnalysis === 'raw' ? '2px solid #6c757d' : 'none' }}
                onClick={() => setActiveAnalysis(activeAnalysis === 'raw' ? null : 'raw')}>
             <i className="bi bi-table text-secondary mb-3" style={{ fontSize: '3rem' }}></i>
             <h5>Raw Data Table</h5>
          </Card>
        </Col>
      </Row>

      {/* SECTIONS WITH CLOSE BUTTONS */}
      {(activeAnalysis === 'selection' || activeAnalysis === 'all') && (
        <div className="mb-5 animate__animated animate__fadeIn">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-primary fw-bold mb-0">Selection Distribution</h4>
            <Button variant="outline-danger" size="sm" className="no-print" onClick={() => setActiveAnalysis(null)}>
               Close Section &times;
            </Button>
          </div>
          <Row>{renderSelectionCharts()}</Row>
        </div>
      )}

      {(activeAnalysis === 'numerical' || activeAnalysis === 'all') && (
        <div className="mb-5 animate__animated animate__fadeIn">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-success fw-bold mb-0">Numerical Trends</h4>
            <Button variant="outline-danger" size="sm" className="no-print" onClick={() => setActiveAnalysis(null)}>
               Close Section &times;
            </Button>
          </div>
          <Row>{renderNumericalCharts()}</Row>
        </div>
      )}

      {(activeAnalysis === 'raw' || activeAnalysis === 'all') && (
        <div className="mb-5 animate__animated animate__fadeIn">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-secondary fw-bold mb-0">Detailed Submissions</h4>
            <Button variant="outline-danger" size="sm" className="no-print" onClick={() => setActiveAnalysis(null)}>
               Close Table &times;
            </Button>
          </div>
          <Card className="shadow-sm border-0"><Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr><th>#</th>{formSchema.fields.map(f => <th key={f.id}>{f.label}</th>)}<th>Date</th></tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr key={idx}><td>{idx + 1}</td>{formSchema.fields.map(f => <td key={f.id}>{sub.studentData?.[f.id] || '-'}</td>)}<td>{sub.submittedAt}</td></tr>
                ))}
              </tbody>
            </Table>
          </Card.Body></Card>
        </div>
      )}
    </Container>
  );
};

export default FormAnalysisView;