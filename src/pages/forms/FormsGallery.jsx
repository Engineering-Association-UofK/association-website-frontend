// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormCard from './formcard'; 
// import { useLanguage } from '../../context/LanguageContext';

// function FormsGallery() {
//   const navigate = useNavigate();
//   const { language } = useLanguage(); 
//   const [counts, setCounts] = useState({ competitions: 0, positions: 0, workshops: 0 });

//   // --- Logic: Fetch and count published forms from localStorage ---
//   useEffect(() => {
//     // 1. Read data from "Database"
//     const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    
//     // 2. Filter for Published only
//     const publishedOnly = allForms.filter(f => f.status === 'published');

//     // 3. Count by category
//     const newCounts = {
//       competitions: publishedOnly.filter(f => f.category === 'competitions').length,
//       positions: publishedOnly.filter(f => f.category === 'positions').length,
//       workshops: publishedOnly.filter(f => f.category === 'workshops').length,
//     };

//     setCounts(newCounts);
//   }, []);

//   const categories = [
//     { 
//       id: 'competitions', 
//       title: { en: 'Competitions', ar: 'المسابقات' }, 
//       available: counts.competitions, 
//       description: { 
//         en: 'Join our technical and creative challenges.', 
//         ar: 'انضم إلى تحدياتنا التقنية والإبداعية.' 
//       } 
//     },
//     { 
//       id: 'positions', 
//       title: { en: 'Apply for Position', ar: 'التقديم على منصب' }, 
//       available: counts.positions, 
//       description: { 
//         en: 'Become a leader or a member in our offices.', 
//         ar: 'كن قائداً أو عضواً في مكاتبنا المختلفة.' 
//       } 
//     },
//     { 
//       id: 'workshops', 
//       title: { en: 'Workshop Attendance', ar: 'حضور ورش العمل' }, 
//       available: counts.workshops, 
//       description: { 
//         en: 'Register for training in upcoming workshops.', 
//         ar: 'سجل للحصول على تدريب في ورش العمل القادمة.' 
//       } 
//     },
//   ];

//   const pageTitle = language === 'ar' ? 'نماذج الطلاب' : 'Student Forms';

//   return (
//     <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <div style={{ textAlign: 'center', marginBottom: '50px' }}>
//         <h1 style={{ color: '#004a99', fontSize: '2.5rem' }}>{pageTitle}</h1>
//         <div style={{ width: '60px', height: '4px', backgroundColor: '#3b82f6', margin: '10px auto' }}></div>
//       </div>

//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
//         gap: '25px',
//         direction: language === 'ar' ? 'rtl' : 'ltr' 
//       }}>
//         {categories.map((cat) => (
//           /* FIX: Added the 'key' prop here to stop the console error */
//           <FormCard 
//             key={cat.id} 
//             title={cat.title[language]}
//             available={cat.available}
//             description={cat.description[language]} // Added description back so cards look good
//             showDeadline={false} 
//             btnLabel={language === 'ar' ? "استكشف الفرص" : "Explore Opportunities"}
//             onClick={() => navigate(`/forms/category/${cat.id}`)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FormsGallery;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormCard from './formcard';
// import { useLanguage } from '../../context/LanguageContext';
// import { endpoints, authFetch } from '../../config/api';

// function FormsGallery() {
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const [counts, setCounts] = useState({ competitions: 0, positions: 0, workshops: 0 });

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const res = await authFetch(endpoints.forms);
//         const data = await res.json();
//         const activeForms = Array.isArray(data) ? data.filter(f => f.is_active) : [];

//         // Backend doesn't have category yet so count all active forms
//         setCounts({
//           competitions: activeForms.length,
//           positions: activeForms.length,
//           workshops: activeForms.length,
//         });
//       } catch (err) {
//         console.error("Failed to load forms:", err);
//       }
//     };
//     fetchForms();
//   }, []);

//   const categories = [
//     {
//       id: 'competitions',
//       title: { en: 'Competitions', ar: 'المسابقات' },
//       available: counts.competitions,
//       description: {
//         en: 'Join our technical and creative challenges.',
//         ar: 'انضم إلى تحدياتنا التقنية والإبداعية.'
//       }
//     },
//     {
//       id: 'positions',
//       title: { en: 'Apply for Position', ar: 'التقديم على منصب' },
//       available: counts.positions,
//       description: {
//         en: 'Become a leader or a member in our offices.',
//         ar: 'كن قائداً أو عضواً في مكاتبنا المختلفة.'
//       }
//     },
//     {
//       id: 'workshops',
//       title: { en: 'Workshop Attendance', ar: 'حضور ورش العمل' },
//       available: counts.workshops,
//       description: {
//         en: 'Register for training in upcoming workshops.',
//         ar: 'سجل للحصول على تدريب في ورش العمل القادمة.'
//       }
//     },
//   ];

//   const pageTitle = language === 'ar' ? 'نماذج الطلاب' : 'Student Forms';

//   return (
//     <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <div style={{ textAlign: 'center', marginBottom: '50px' }}>
//         <h1 style={{ color: '#004a99', fontSize: '2.5rem' }}>{pageTitle}</h1>
//         <div style={{ width: '60px', height: '4px', backgroundColor: '#3b82f6', margin: '10px auto' }}></div>
//       </div>

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
//         gap: '25px',
//         direction: language === 'ar' ? 'rtl' : 'ltr'
//       }}>
//         {categories.map((cat) => (
//           <FormCard
//             key={cat.id}
//             title={cat.title[language]}
//             available={cat.available}
//             description={cat.description[language]}
//             showDeadline={false}
//             btnLabel={language === 'ar' ? "استكشف الفرص" : "Explore Opportunities"}
//             onClick={() => navigate(`/forms/category/${cat.id}`)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FormsGallery;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormCard from './formcard';
// import { useLanguage } from '../../context/LanguageContext';
// import { endpoints, authFetch } from '../../config/api';

// function FormsGallery() {
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const [counts, setCounts] = useState({ competitions: 0, positions: 0, workshops: 0 });

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const res = await authFetch(endpoints.forms);
//         const data = await res.json();
//         const now = new Date();

//         // Filter active forms only (end_date not passed)
//         const activeForms = Array.isArray(data)
//           ? data.filter(f => new Date(f.end_date) > now)
//           : [];

//         // Count by backend type field
//         setCounts({
//           competitions: activeForms.filter(f => f.type === 'competitions').length,
//           positions: activeForms.filter(f => f.type === 'positions').length,
//           workshops: activeForms.filter(f => f.type === 'workshops').length,
//         });
//       } catch (err) {
//         console.error("Failed to load forms:", err);
//       }
//     };
//     fetchForms();
//   }, []);

//   const categories = [
//     {
//       id: 'competitions',
//       title: { en: 'Competitions', ar: 'المسابقات' },
//       available: counts.competitions,
//       description: {
//         en: 'Join our technical and creative challenges.',
//         ar: 'انضم إلى تحدياتنا التقنية والإبداعية.'
//       }
//     },
//     {
//       id: 'positions',
//       title: { en: 'Apply for Position', ar: 'التقديم على منصب' },
//       available: counts.positions,
//       description: {
//         en: 'Become a leader or a member in our offices.',
//         ar: 'كن قائداً أو عضواً في مكاتبنا المختلفة.'
//       }
//     },
//     {
//       id: 'workshops',
//       title: { en: 'Workshop Attendance', ar: 'حضور ورش العمل' },
//       available: counts.workshops,
//       description: {
//         en: 'Register for training in upcoming workshops.',
//         ar: 'سجل للحصول على تدريب في ورش العمل القادمة.'
//       }
//     },

//   ];

//   return (
//     <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <div style={{ textAlign: 'center', marginBottom: '50px' }}>
//         <h1 style={{ color: '#004a99', fontSize: '2.5rem' }}>
//           {language === 'ar' ? 'نماذج الطلاب' : 'Student Forms'}
//         </h1>
//         <div style={{ width: '60px', height: '4px', backgroundColor: '#3b82f6', margin: '10px auto' }}></div>
//       </div>

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
//         gap: '25px',
//         direction: language === 'ar' ? 'rtl' : 'ltr'
//       }}>
//         {categories.map((cat) => (
//           <FormCard
//             key={cat.id}
//             title={cat.title[language]}
//             available={cat.available}
//             description={cat.description[language]}
//             showDeadline={false}
//             btnLabel={language === 'ar' ? "استكشف الفرص" : "Explore Opportunities"}
//             onClick={() => navigate(`/forms/category/${cat.id}`)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FormsGallery;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from './formcard';
import { useLanguage } from '../../context/LanguageContext';
import { endpoints, authFetch } from '../../config/api';

// Map backend type values → display labels
// Add any new types your backend team creates here
const TYPE_CONFIG = {
  competitions: {
    title: { en: 'Competitions', ar: 'المسابقات' },
    description: {
      en: 'Join our technical and creative challenges.',
      ar: 'انضم إلى تحدياتنا التقنية والإبداعية.'
    }
  },
  positions: {
    title: { en: 'Apply for Position', ar: 'التقديم على منصب' },
    description: {
      en: 'Become a leader or a member in our offices.',
      ar: 'كن قائداً أو عضواً في مكاتبنا المختلفة.'
    }
  },
  workshops: {
    title: { en: 'Workshop Attendance', ar: 'حضور ورش العمل' },
    description: {
      en: 'Register for training in upcoming workshops.',
      ar: 'سجل للحضول على تدريب في ورش العمل القادمة.'
    }
  },
  event: {
    title: { en: 'Events', ar: 'الفعاليات' },
    description: {
      en: 'Register for upcoming events and activities.',
      ar: 'سجل للفعاليات والأنشطة القادمة.'
    }
  },
  test: {
    title: { en: 'Tests', ar: 'الاختبارات' },
    description: {
      en: 'Take part in assessments and evaluations.',
      ar: 'شارك في التقييمات والاختبارات.'
    }
  }
};

function FormsGallery() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await authFetch(endpoints.forms);
        const data = await res.json();
        const now = new Date();

        // Only active forms
        const activeForms = Array.isArray(data)
          ? data.filter(f => new Date(f.end_date) > now)
          : [];

        console.log("Active forms:", activeForms.length);

        // Get unique types from backend
        const uniqueTypes = [...new Set(activeForms.map(f => f.type).filter(Boolean))];
        console.log("Types found:", uniqueTypes);

        // Build category cards dynamically from backend types
        const builtCategories = uniqueTypes.map(type => {
          const config = TYPE_CONFIG[type] || {
            title: { en: type, ar: type }, // fallback: show raw type name
            description: { en: 'Click to explore.', ar: 'اضغط للاستكشاف.' }
          };

          return {
            id: type,
            title: config.title,
            available: activeForms.filter(f => f.type === type).length,
            description: config.description
          };
        });

        setCategories(builtCategories);
      } catch (err) {
        console.error("Failed to load forms:", err);
      }
    };
    fetchForms();
  }, []);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: '#004a99', fontSize: '2.5rem' }}>
          {language === 'ar' ? 'نماذج الطلاب' : 'Student Forms'}
        </h1>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#3b82f6', margin: '10px auto' }}></div>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-muted">No active forms available.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px',
          direction: language === 'ar' ? 'rtl' : 'ltr'
        }}>
          {categories.map((cat) => (
            <FormCard
              key={cat.id}
              title={cat.title[language]}
              available={cat.available}
              description={cat.description[language]}
              showDeadline={false}
              btnLabel={language === 'ar' ? "استكشف الفرص" : "Explore Opportunities"}
              onClick={() => navigate(`/forms/category/${cat.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FormsGallery;