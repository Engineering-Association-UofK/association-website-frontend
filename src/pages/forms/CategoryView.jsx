// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button } from 'react-bootstrap'; 
// import { useLanguage } from '../../context/LanguageContext';
// import FormCard from './formcard'; 

// const CategoryView = () => {
//   const { categoryId } = useParams(); 
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const [filteredForms, setFilteredForms] = useState([]);

//   useEffect(() => {
//     const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
//     const match = allForms.filter(f => f.status === 'published' && f.category === categoryId);
//     setFilteredForms(match);
//   }, [categoryId]);

//   const getFormStatus = (openDate, closeDate) => {
//     const now = new Date();
//     const start = new Date(openDate);
//     const end = new Date(closeDate);
//     if (now < start) return language === 'ar' ? 'يفتح قريباً' : 'Opening Soon';
//     if (now > end) return language === 'ar' ? 'منتهي' : 'Closed';
//     return language === 'ar' ? 'مفتوح الآن' : 'Opened';
//   };

//   const getRemainingTime = (closeDate) => {
//     if (!closeDate) return "";
//     const diff = new Date(closeDate) - new Date();
//     if (diff <= 0) return "";
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     return language === 'ar' ? `متبقي ${hours} ساعة` : `${hours}h left`;
//   };

//   return (
//     <Container className="py-5" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
//       <h2 className="mb-4 text-start text-primary fw-bold">Available Forms</h2>
//       {filteredForms.length > 0 ? (
//         <Row className="g-4">
//           {filteredForms.map((form) => {
//             const status = getFormStatus(form.openDate, form.closeDate);
//             const isOpen = status === (language === 'ar' ? 'مفتوح الآن' : 'Opened');
            
//             return (
//               <Col key={form.id} md={6} lg={4}>
//                 <FormCard 
//                   title={form.title}
//                   description={language === 'ar' ? 'اضغط للتقديم' : 'Click to apply'}
//                   status={status}
//                   deadline={getRemainingTime(form.closeDate)}
//                   showDeadline={isOpen}
//                   btnLabel={language === 'ar' ? "قدم الآن" : "Apply Now"}
                  
//                   /* NEW FIX: Block navigation if the form is not 'Opened' */
//                   onClick={() => {
//                     if (status === (language === 'ar' ? 'مفتوح الآن' : 'Opened')) {
//                       navigate(`/apply/${form.id}`);
//                     } else if (status === (language === 'ar' ? 'يفتح قريباً' : 'Opening Soon')) {
//                       alert(language === 'ar' ? 'هذا النموذج لم يفتح بعد.' : 'This form has not opened yet.');
//                     } else {
//                       alert(language === 'ar' ? 'عذراً، هذا النموذج مغلق حالياً.' : 'Sorry, this form is currently closed.');
//                     }
//                   }}
//                 />
//               </Col>
//             );
//           })}
//         </Row>
//       ) : <p className="text-muted">No forms available.</p>}
//     </Container>
//   );
// };

// export default CategoryView;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Spinner } from 'react-bootstrap';
// import { useLanguage } from '../../context/LanguageContext';
// import FormCard from './formcard';
// import { endpoints, authFetch } from '../../config/api';

// const CategoryView = () => {
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const res = await authFetch(endpoints.forms);
//         const data = await res.json();
//         // Show all active forms for now since backend has no category field yet
//         const active = Array.isArray(data) ? data.filter(f => f.is_active) : [];
//         setForms(active);
//       } catch (err) {
//         console.error("Failed to load forms:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForms();
//   }, [categoryId]);

//   if (loading) return (
//     <Container className="text-center py-5">
//       <Spinner animation="border" variant="primary" />
//     </Container>
//   );

//   return (
//     <Container className="py-5" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
//       <h2 className="mb-4 text-start text-primary fw-bold">
//         {language === 'ar' ? 'النماذج المتاحة' : 'Available Forms'}
//       </h2>

//       {forms.length === 0 ? (
//         <p className="text-muted">
//           {language === 'ar' ? 'لا توجد نماذج متاحة.' : 'No forms available.'}
//         </p>
//       ) : (
//         <Row className="g-4">
//           {forms.map((form) => (
//             <Col key={form.id} md={6} lg={4}>
//               <FormCard
//                 title={form.title}
//                 description={form.description || (language === 'ar' ? 'اضغط للتقديم' : 'Click to apply')}
//                 status={language === 'ar' ? 'مفتوح الآن' : 'Opened'}
//                 showDeadline={false}
//                 btnLabel={language === 'ar' ? "قدم الآن" : "Apply Now"}
//                 onClick={() => navigate(`/apply/${form.id}`)}
//               />
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default CategoryView;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import FormCard from './formcard';
import { endpoints, authFetch } from '../../config/api';

const CategoryView = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await authFetch(endpoints.forms);
        const data = await res.json();
        const now = new Date();

        // Filter by type AND not expired
        const filtered = Array.isArray(data)
          ? data.filter(f => f.type === categoryId && new Date(f.end_date) > now)
          : [];

        setForms(filtered);
      } catch (err) {
        console.error("Failed to load forms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [categoryId]);

  const getStatus = (form) => {
    const now = new Date();
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (now < start) return language === 'ar' ? 'يفتح قريباً' : 'Opening Soon';
    if (now > end) return language === 'ar' ? 'منتهي' : 'Closed';
    return language === 'ar' ? 'مفتوح الآن' : 'Opened';
  };

  const getTimeLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return '';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return language === 'ar' ? `متبقي ${days} يوم` : `${days}d left`;
    return language === 'ar' ? `متبقي ${hours} ساعة` : `${hours}h left`;
  };

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container className="py-5" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <h2 className="mb-4 text-start text-primary fw-bold">
        {language === 'ar' ? 'النماذج المتاحة' : 'Available Forms'}
      </h2>

      {forms.length === 0 ? (
        <p className="text-muted">
          {language === 'ar' ? 'لا توجد نماذج متاحة.' : 'No forms available in this category.'}
        </p>
      ) : (
        <Row className="g-4">
          {forms.map((form) => {
            const status = getStatus(form);
            const isOpen = status === (language === 'ar' ? 'مفتوح الآن' : 'Opened');

            return (
              <Col key={form.id} md={6} lg={4}>
                <FormCard
                  title={form.title}
                  description={form.description || (language === 'ar' ? 'اضغط للتقديم' : 'Click to apply')}
                  status={status}
                  deadline={getTimeLeft(form.end_date)}
                  showDeadline={isOpen}
                  btnLabel={language === 'ar' ? "قدم الآن" : "Apply Now"}
                  onClick={() => {
                    if (isOpen) {
                      navigate(`/apply/${form.id}`);
                    } else {
                      alert(language === 'ar'
                        ? 'هذا النموذج غير متاح حالياً.'
                        : `This form is currently ${status.toLowerCase()}.`
                      );
                    }
                  }}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default CategoryView;