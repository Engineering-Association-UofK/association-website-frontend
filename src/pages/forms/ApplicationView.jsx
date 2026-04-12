// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Spinner, Button } from 'react-bootstrap';
// import ApplicationForm from './ApplicationForm'; // Importing the renderer

// const ApplicationView = () => {
//   const { formId } = useParams();
//   const navigate = useNavigate();
//   const [targetForm, setTargetForm] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 1. Logic: Fetch all forms from storage
//     const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    
//     // 2. Find the specific form by ID
//     const found = allForms.find(f => f.id.toString() === formId);

    
//     if (found) {
     
//     // --- NEW SECURITY LOGIC ---
//     const now = new Date();
//     const closeDate = new Date(found.closeDate);

//     if (now > closeDate) {
//       alert("This form is now closed and no longer accepting submissions.");
//       navigate('/forms'); // Kick them back to the gallery
//       return;
//     }
//       setTargetForm(found);
//     } else {
//       alert("Form not found in database!");
//       navigate('/forms');
//     }
//     setLoading(false);
//   }, [formId, navigate]);

//   if (loading) return (
//     <Container className="text-center py-5">
//       <Spinner animation="border" variant="primary" />
//     </Container>
//   );

//   // Inside ApplicationView.jsx, the return section:
// // ApplicationView.jsx
// return (
//   <div className="bg-light min-vh-100"> 
//     {/* Only the back button stays outside if you want, or put it inside */}
//     <Container className="pt-4 text-start">
//       <Button variant="link" onClick={() => navigate(-1)} className="p-0 mb-2">
//         &larr; Back
//       </Button>
//     </Container>

//     {/* The Form handles the Title and Description inside the white box */}
//     <ApplicationForm schema={targetForm} />
//   </div>
// );
// };

// export default ApplicationView;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Spinner } from 'react-bootstrap';
// import ApplicationForm from './ApplicationForm';
// import { endpoints,authFetch } from '../../config/api';

// const ApplicationView = () => {
//   const { formId } = useParams();
//   const navigate = useNavigate();
//   const [targetForm, setTargetForm] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         // Fetch the specific form from the backend link
//         const response = await authFetch(`${endpoints.forms}/${formId}`);
//         if (!response.ok) throw new Error("Form not found");
//         const data = await response.json();
        
//         setTargetForm(data);
//       } catch (error) {
//         console.error("Fetch Error:", error);
//         alert("Could not load the form from the server.");
//         navigate('/forms');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFormStructure();
//   }, [formId, navigate]);

//   if (loading) return (
//     <Container className="text-center py-5"><Spinner animation="border" variant="primary" /></Container>
//   );

//   return (
//     <div className="bg-light min-vh-100"> 
//       <ApplicationForm schema={targetForm} />
//     </div>
//   );
// };

// export default ApplicationView;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import ApplicationForm from './ApplicationForm';
import { endpoints, authFetch } from '../../config/api';

const ApplicationView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await authFetch(`${endpoints.forms}/${formId}`);
        const data = await res.json();
        console.log("Raw backend data:", JSON.stringify(data));

        // Backend returns { form, pages, questions }
        // We need to reshape it to match ApplicationForm's expected schema:
        // { id, title, description, pages: [{ id, title, fields: [...questions] }] }

        const { form, pages, questions } = data;

        const reshapedSchema = {
          id: form.id,
          title: form.title,
          description: form.description,
          pages: pages.map((page, idx) => ({
            id: page.id,
            title: `Step ${page.page_num}`,
            // Attach questions that belong to this page
            fields: questions
              .filter(q => q.form_page_id === page.id)
              .sort((a, b) => a.display_order - b.display_order)
              .map(q => ({
                id: q.id,
                label: q.question_text,
                type: mapBackendType(q.type),
                subType: mapSubType(q.type),
                isRequired: q.is_required,
                options: q.options || []
              }))
          }))
        };

        console.log("Reshaped schema:", JSON.stringify(reshapedSchema));
        setSchema(reshapedSchema);

      } catch (err) {
        console.error("Fetch error:", err);
        alert("Could not load the form.");
        navigate('/forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, navigate]);

  // Map backend question types → frontend field types
  const mapBackendType = (backendType) => {
    const map = {
      'TEXT': 'text',
      'PARAGRAPH': 'text',
      'NUMBER': 'number',
      'RADIO': 'choice',
      'CHECKBOX': 'choice',
      'DROPDOWN': 'choice',
    };
    return map[backendType] || 'text';
  };

  const mapSubType = (backendType) => {
    if (backendType === 'PARAGRAPH') return 'long';
    if (backendType === 'NUMBER') return 'number';
    return 'short';
  };

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (!schema) return (
    <Container className="text-center py-5">
      <p className="text-muted">Form not found.</p>
    </Container>
  );

  return (
    <div className="bg-light min-vh-100">
      <ApplicationForm schema={schema} />
    </div>
  );
};

export default ApplicationView;