// import React, { useState } from 'react';
// import { Form, Button, Card, Image, Container } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// import TextField from '../../components/FormFields/TextField';
// import AssociationLogo from '../../assets/OIP.webp';

// // --- IMPORTING YOUR NEW FILENAME ---
// import bgImage from '../../assets/uofk.png'; 

// const ApplicationForm = ({ schema }) => {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [fieldValidity, setFieldValidity] = useState({});
//   const totalPages = schema.pages.length;

//   const handleInputChange = (fieldId, value, isValid = true) => {
//     setAnswers(prev => ({ ...prev, [fieldId]: value }));
//     setFieldValidity(prev => ({ ...prev, [fieldId]: isValid }));
//   };

//   const handleNext = (e) => {
//     e.preventDefault();
//     const currentFields = schema.pages[currentPage].fields;
    
//     const hasError = currentFields.find(
//       f => (f.isRequired && !answers[f.id]) || fieldValidity[f.id] === false
//     );

//     if (hasError) {
//       alert("Please ensure all fields are filled correctly before moving to the next step.");
//       return;
//     }

//     setCurrentPage(prev => prev + 1);
//     window.scrollTo(0, 0);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const submission = {
//       id: Date.now(),
//       formId: schema.id,
//       studentData: answers,
//       submittedAt: new Date().toLocaleString()
//     };

//     const existing = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
//     localStorage.setItem('allSubmissions', JSON.stringify([submission, ...existing]));

//     alert("🎉 Application Submitted Successfully!");
//     navigate('/forms');
//   };

//   return (
//     <div style={{ 
//       position: 'relative', 
//       minHeight: '100vh', 
//       width: '100%', 
//       display: 'flex', 
//       justifyContent: 'center', 
//       alignItems: 'center',
//       padding: '40px 20px',
//       overflow: 'hidden',
//       backgroundColor: '#f8fafc' // Subtle fallback color
//     }}>
      
//       {/* --- BACKGROUND IMAGE LAYER --- */}
//       {/* --- BACKGROUND IMAGE LAYER --- */}
// <div style={{
//   position: 'fixed', 
//   top: 0, 
//   left: 0, 
//   right: 0, 
//   bottom: 0,
//   backgroundImage: `url(${bgImage})`,
//   backgroundSize: 'cover',
  
//   // --- CHANGE THIS LINE TO MOVE PICTURE DOWN ---
//   backgroundPosition: 'center 80%', // 50% is center, 75% is lower, 100% is bottom
  
//   filter: 'blur(10px) brightness(0.9)', 
//   transform: 'scale(1.15)', // Slightly increased to cover the gap created by moving it
//   zIndex: 1
// }}></div>

//       {/* --- CONTENT CONTAINER --- */}
//       <Container style={{ maxWidth: '820px', zIndex: 10, position: 'relative' }}>
//         <Card
//           className="overflow-hidden shadow-lg"
//           style={{
//             borderRadius: '28px',
//             background: 'rgba(255, 255, 255, 0.98)',
//             border: '2px solid #ececed', // ELEGANT BLUE BORDER
//             boxShadow: '0 10px 40px rgba(207, 214, 227, 0.15)' // SOFT BLUE GLOW
//           }}
//         >
//           {/* HEADER SECTION */}
//           <div className="text-center px-4 px-md-5 pt-5 pb-4 border-bottom bg-white">
            
//             {/* CIRCULAR LOGO */}
//             <div
//               className="mx-auto mb-4 shadow-sm"
//               style={{
//                 width: '100px', height: '100px', borderRadius: '50%',
//                 background: '#ffffff', display: 'flex', justifyContent: 'center',
//                 alignItems: 'center', border: '3px solid #f1f5f9', overflow: 'hidden'
//               }}
//             >
//               <Image src={AssociationLogo} style={{ width: '80%', objectFit: 'contain' }} />
//             </div>

//             <h2 className="fw-bold" style={{ color: '#1e293b' }}>{schema.title}</h2>
//             <p className="text-muted small">{schema.description}</p>

//             {/* STEPPER UI */}
//             <div className="d-flex align-items-center mt-4 px-lg-5">
//               {schema.pages.map((_, idx) => (
//                 <React.Fragment key={idx}>
//                   <div
//                     onClick={() => idx < currentPage && setCurrentPage(idx)}
//                     style={{
//                       width: '32px', height: '32px', borderRadius: '50%',
//                       backgroundColor: idx <= currentPage ? '#2563eb' : '#e2e8f0',
//                       color: 'white', display: 'flex', alignItems: 'center',
//                       justifyContent: 'center', fontSize: '13px', fontWeight: 'bold',
//                       cursor: idx < currentPage ? 'pointer' : 'default',
//                       transition: '0.3s'
//                     }}
//                   >
//                     {idx + 1}
//                   </div>
//                   {idx < totalPages - 1 && (
//                     <div style={{
//                       flex: 1, height: '2px',
//                       backgroundColor: idx < currentPage ? '#2563eb' : '#e2e8f0',
//                       margin: '0 10px'
//                     }} />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>

//             <h6 className="mt-4 fw-bold" style={{ color: '#2563eb' }}>
//               Step {currentPage + 1} of {totalPages}
//             </h6>
//             <p className="text-muted small uppercase">{schema.pages[currentPage].title}</p>
//           </div>

//           {/* QUESTIONS BODY */}
//           <Card.Body className="px-4 px-md-5 py-5 bg-white">
//             <Form onSubmit={handleSubmit}>
//               {schema.pages[currentPage].fields.map((field) => (
//                 <div key={field.id} className="mb-4">
//                   {field.type === 'text' && (
//                     <TextField
//                       label={field.label}
//                       type={field.subType}
//                       isRequired={field.isRequired}
//                       onChange={(v, valid) => handleInputChange(field.id, v, valid)}
//                     />
//                   )}
//                   {/* Note: Add checks here for 'number', 'choice', 'file' as needed */}
//                 </div>
//               ))}

//               {/* FOOTER BUTTONS */}
//               <div className="d-flex justify-content-between mt-5 pt-4 border-top">
//                 <Button
//                   variant="light"
//                   disabled={currentPage === 0}
//                   onClick={() => setCurrentPage(prev => prev - 1)}
//                   style={{ borderRadius: '12px', padding: '10px 25px' }}
//                 >
//                   Back
//                 </Button>

//                 {currentPage < totalPages - 1 ? (
//                   <Button
//                     type="button"
//                     onClick={handleNext}
//                     style={{
//                       background: '#2563eb', border: 'none', borderRadius: '12px',
//                       padding: '12px 35px', fontWeight: 600
//                     }}
//                   >
//                     Continue →
//                   </Button>
//                 ) : (
//                   <Button
//                     type="submit"
//                     style={{
//                       background: '#16a34a', border: 'none', borderRadius: '12px',
//                       padding: '12px 35px', fontWeight: 600
//                     }}
//                   >
//                     Submit ✓
//                   </Button>
//                 )}
//               </div>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default ApplicationForm;

import React, { useState } from 'react';
import { Form, Button, Card, Image, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TextField from '../../components/FormFields/TextField';
import AssociationLogo from '../../assets/OIP.webp';
import bgImage from '../../assets/uofk.png'; 
import { endpoints, authFetch } from '../../config/api';// Import your new endpoints

const ApplicationForm = ({ schema }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});
  const totalPages = schema.pages.length;

  const handleInputChange = (fieldId, value, isValid = true) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    setFieldValidity(prev => ({ ...prev, [fieldId]: isValid }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const currentFields = schema.pages[currentPage].fields;
    const hasError = currentFields.find(f => (f.isRequired && !answers[f.id]) || fieldValidity[f.id] === false);

    if (hasError) {
      alert("Please ensure all fields are filled correctly before moving to the next step.");
      return;
    }
    setCurrentPage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NEW BACKEND FORMATTING ---
    // Convert your local { fieldId: value } into the backend's [{ question_id, answer_value }]
    const formattedAnswers = Object.keys(answers).map(fieldId => ({
      question_id: parseInt(fieldId),
      answer_value: answers[fieldId].toString()
    }));

    const submissionPayload = {
      form_id: schema.id,
      Answers: formattedAnswers
    };

    try {
      const response = await authFetch(endpoints.submit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });

      if (response.ok) {
        alert("🎉 Application Submitted Successfully!");
        navigate('/forms');
      } else {
        alert("Submission failed. Please check your connection.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Error connecting to the server.");
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', overflow: 'hidden' }}>
      
      {/* BACKGROUND LAYER */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 80%', 
        filter: 'blur(10px) brightness(0.9)', 
        transform: 'scale(1.15)', 
        zIndex: 1
      }}></div>

      <Container style={{ maxWidth: '820px', zIndex: 10, position: 'relative' }}>
        <Card className="overflow-hidden shadow-lg" style={{ borderRadius: '28px', background: 'rgba(255, 255, 255, 0.98)', border: '2px solid #ececed' }}>
          
          <div className="text-center px-4 px-md-5 pt-5 pb-4 border-bottom bg-white">
            <div className="mx-auto mb-4 shadow-sm" style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #f1f5f9', overflow: 'hidden' }}>
              <Image src={AssociationLogo} style={{ width: '80%', objectFit: 'contain' }} />
            </div>

            <h2 className="fw-bold" style={{ color: '#1e293b' }}>{schema.title}</h2>
            <p className="text-muted small">{schema.description}</p>

            {/* STEPPER UI */}
            <div className="d-flex align-items-center mt-4 px-lg-5">
              {schema.pages.map((_, idx) => (
                <React.Fragment key={idx}>
                  <div onClick={() => idx < currentPage && setCurrentPage(idx)} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: idx <= currentPage ? '#2563eb' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', cursor: idx < currentPage ? 'pointer' : 'default', transition: '0.3s' }}>{idx + 1}</div>
                  {idx < totalPages - 1 && <div style={{ flex: 1, height: '2px', backgroundColor: idx < currentPage ? '#2563eb' : '#e2e8f0', margin: '0 10px' }} />}
                </React.Fragment>
              ))}
            </div>

            <h6 className="mt-4 fw-bold" style={{ color: '#2563eb' }}>Step {currentPage + 1} of {totalPages}</h6>
            <p className="text-muted small uppercase">{schema.pages[currentPage].title}</p>
          </div>

          <Card.Body className="px-4 px-md-5 py-5 bg-white">
            <Form onSubmit={handleSubmit}>
              {schema.pages[currentPage].fields.map((field) => (
                <div key={field.id} className="mb-4">
                  {field.type === 'text' && (
                    <TextField label={field.label} type={field.subType} isRequired={field.isRequired} onChange={(v, valid) => handleInputChange(field.id, v, valid)} />
                  )}
                  {/* Add checks here for other field types if necessary */}
                </div>
              ))}

              <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                <Button variant="light" disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} style={{ borderRadius: '12px', padding: '10px 25px' }}>Back</Button>
                {currentPage < totalPages - 1 ? (
                  <Button type="button" onClick={handleNext} style={{ background: '#2563eb', border: 'none', borderRadius: '12px', padding: '12px 35px', fontWeight: 600 }}>Continue →</Button>
                ) : (
                  <Button type="submit" style={{ background: '#16a34a', border: 'none', borderRadius: '12px', padding: '12px 35px', fontWeight: 600 }}>Submit ✓</Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ApplicationForm;