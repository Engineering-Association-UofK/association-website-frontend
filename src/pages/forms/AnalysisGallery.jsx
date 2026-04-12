
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import FormCard from './formcard'; // Ensure path is correct

// import React, { useState, useEffect } from 'react';
// import { endpoints } from '../../config/api'; // Import our new config

// const AnalysisGallery = () => {
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const res = await fetch(endpoints.forms);
//         const data = await res.json();
//         setForms(data);
//       } catch (err) {
//         console.error("Failed to load forms from duckdns:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForms();
//   }, []);
//   return (
//     <Container className="py-5 text-start">
//       <div className="d-flex justify-content-between align-items-center mb-5">
//         <h2 className="text-primary fw-bold">Active Forms Analysis</h2>
//         <Button variant="outline-primary" onClick={() => navigate('/admin/forms')}>
//           Back to Dashboard
//         </Button>
//       </div>

//       <Row className="g-4">
//         {forms.map(form => (
//           <Col key={form.id} md={6} lg={4}>
//             <FormCard 
//               title={form.title}
//               available={form.submissionCount} 
//               status={form.status === 'published' ? 'Active' : 'Draft'}
//               description="Review student responses and statistical data for this form."
//               btnLabel="View Detailed Analysis"
//               onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
//               showDeadline={false}
//             />
//           </Col>
//         ))}
//       </Row>
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
//           <p className="text-muted">Monitor performance and view response statistics.</p>
//         </div>
//         <Button variant="outline-primary" className="px-4 fw-bold" onClick={() => navigate('/admin/forms')}>
//           Back to Dashboard
//         </Button>
//       </div>

//       {forms.length === 0 ? (
//         <div className="text-center py-5 bg-light rounded shadow-sm">
//           <h5 className="text-muted">No forms created yet.</h5>
//         </div>
//       ) : (
//         <Row className="g-4">
//           {forms.map(form => (
//             <Col key={form.id} md={6} lg={4}>
//               <FormCard
//                 title={form.title}
//                 available={0}
//                 status={form.is_active ? 'Active' : 'Inactive'}
//                 description={form.description || "Review student responses and statistical data."}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import FormCard from './formcard';
import { endpoints, authFetch } from '../../config/api';

const AnalysisGallery = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await authFetch(endpoints.forms);
        const data = await res.json();
        setForms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load forms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container className="py-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="text-primary fw-bold">Forms Data Analysis</h2>
          <p className="text-muted">Monitor performance and view response statistics.</p>
        </div>
        <Button variant="outline-primary" className="px-4 fw-bold" onClick={() => navigate('/admin/forms')}>
          Back to Dashboard
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <h5 className="text-muted">No forms created yet.</h5>
        </div>
      ) : (
        <Row className="g-4">
          {forms.map(form => (
            <Col key={form.id} md={6} lg={4}>
              <FormCard
                title={form.title}
                available={0}
                status={form.is_active ? 'Active' : 'Inactive'}
                description={form.description || "Review student responses and statistical data."}
                btnLabel="View Detailed Analysis"
                onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
                showDeadline={false}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AnalysisGallery;