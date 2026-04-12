// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import FormCard from './formcard'; 

// const AnalysisGallery = () => {
//   const navigate = useNavigate();
//   const [forms, setForms] = useState([]);

//   useEffect(() => {
//     // 1. Fetch the data structures
//     const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
//     const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');

//     // 2. Combine them to get accurate submission counts per form
//     const formsWithCounts = allForms.map(f => {
//       // Ensure we compare strings to strings
//       const count = allSubmissions.filter(s => s.formId.toString() === f.id.toString()).length;
//       return {
//         ...f,
//         submissionCount: count
//       };
//     });

//     setForms(formsWithCounts);
//   }, []);

//   return (
//     <Container className="py-5 text-start">
//       <div className="d-flex justify-content-between align-items-center mb-5">
//         <div>
//           <h2 className="text-primary fw-bold">Forms Data Analysis</h2>
//           <p className="text-muted">Monitor performance and view response statistics for your dynamic forms.</p>
//         </div>
//         <Button variant="outline-primary" className="px-4 fw-bold" onClick={() => navigate('/admin/forms')}>
//           Back to Dashboard
//         </Button>
//       </div>

//       {forms.length === 0 ? (
//         <div className="text-center py-5 bg-light rounded shadow-sm">
//           <h5 className="text-muted">No forms created yet. Create a form to see analysis.</h5>
//         </div>
//       ) : (
//         <Row className="g-4">
//           {forms.map(form => (
//             <Col key={form.id} md={6} lg={4}>
//               <FormCard 
//                 title={form.title}
//                 available={form.submissionCount} // Showing submission count here
//                 status={form.status === 'published' ? 'Active' : 'Draft'}
//                 description={form.description || "Review student responses and statistical data for this form."}
//                 btnLabel="View Detailed Analysis"
//                 onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
//                 showDeadline={false}
//               />
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default AnalysisGallery;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
// import FormCard from './formcard';
// import { endpoints, authFetch } from '../../config/api';

// const AnalysisGallery = () => {
//   const navigate = useNavigate();
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const res = await authFetch(endpoints.forms);
//         const data = await res.json();
//         console.log("Forms from backend:", data); // check shape
//         setForms(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load forms:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForms();
//   }, []);

//   if (loading) return (
//     <Container className="text-center py-5">
//       <Spinner animation="border" variant="primary" />
//     </Container>
//   );

//   return (
//     <Container className="py-5 text-start">
//       <div className="d-flex justify-content-between align-items-center mb-5">
//         <div>
//           <h2 className="text-primary fw-bold">Forms Data Analysis</h2>
//           <p className="text-muted">Monitor performance and view response statistics for your dynamic forms.</p>
//         </div>
//         <Button variant="outline-primary" className="px-4 fw-bold" onClick={() => navigate('/admin/forms')}>
//           Back to Dashboard
//         </Button>
//       </div>

//       {forms.length === 0 ? (
//         <div className="text-center py-5 bg-light rounded shadow-sm">
//           <h5 className="text-muted">No forms created yet. Create a form to see analysis.</h5>
//         </div>
//       ) : (
//         <Row className="g-4">
//           {forms.map(form => (
//             <Col key={form.id} md={6} lg={4}>
//               <FormCard
//                 title={form.title}
//                 available={0}
//                 status={form.is_active ? 'Active' : 'Inactive'}
//                 description={form.description || "Review student responses and statistical data for this form."}
//                 btnLabel="View Detailed Analysis"
//                 onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
//                 showDeadline={false}
//               />
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default AnalysisGallery;

// src/pages/forms/FormAnalysisView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge, Table } from 'react-bootstrap';
import { endpoints, authFetch } from '../../config/api';

const FormAnalysisView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formDetail, setFormDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await authFetch(`${endpoints.forms}/${id}`);
        const data = await res.json();
        console.log("Form detail:", JSON.stringify(data));
        setFormDetail(data);
      } catch (err) {
        console.error("Failed to load form detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (!formDetail) return (
    <Container className="text-center py-5">
      <p className="text-muted">Form not found.</p>
    </Container>
  );

  const { form, pages, questions } = formDetail;

  return (
    <Container className="py-5 text-start">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="text-primary fw-bold">{form.title}</h2>
          <p className="text-muted">{form.description}</p>
        </div>
        <Button variant="outline-primary" onClick={() => navigate('/admin/forms/analysis')}>
          Back to Analysis
        </Button>
      </div>

      {/* STATS CARDS */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 p-3">
            <h2 className="text-primary fw-bold">{questions.length}</h2>
            <p className="text-muted mb-0">Total Questions</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 p-3">
            <h2 className="text-primary fw-bold">{pages.length}</h2>
            <p className="text-muted mb-0">Total Pages</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 p-3">
            <h2 className="fw-bold" style={{ color: form.is_active ? '#16a34a' : '#6b7280' }}>
              {form.is_active ? 'Active' : 'Inactive'}
            </h2>
            <p className="text-muted mb-0">Form Status</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 p-3">
            <h2 className="text-primary fw-bold">{form.allow_multiple ? 'Yes' : 'No'}</h2>
            <p className="text-muted mb-0">Multiple Submissions</p>
          </Card>
        </Col>
      </Row>

      {/* QUESTIONS TABLE */}
      <Card className="shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-4">Form Questions</h5>
        {questions.length === 0 ? (
          <p className="text-muted text-center py-3">No questions found for this form.</p>
        ) : (
          <Table responsive hover borderless>
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Type</th>
                <th>Required</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={q.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="fw-bold">{q.question_text}</td>
                  <td>
                    <Badge bg="primary" className="rounded-pill">{q.type}</Badge>
                  </td>
                  <td>
                    <Badge bg={q.is_required ? 'danger' : 'secondary'}>
                      {q.is_required ? 'Required' : 'Optional'}
                    </Badge>
                  </td>
                  <td className="text-muted">
                    {pages.find(p => p.id === q.form_page_id)?.page_num || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* NOTE ABOUT ANALYSIS */}
      <div className="mt-4 p-3 bg-light rounded border text-muted small">
        ⚠️ Detailed response statistics are currently unavailable — the backend analysis 
        endpoint is returning a server error. Please ask the backend team to fix 
        GET /api/v1/form/analysis/:id
      </div>
    </Container>
  );
};

export default FormAnalysisView;