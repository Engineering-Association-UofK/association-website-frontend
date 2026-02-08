import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from './formcard'; 
import { useLanguage } from '../../context/LanguageContext';

function FormsGallery() {
  const navigate = useNavigate();
  const { language } = useLanguage(); 
  const [counts, setCounts] = useState({ competitions: 0, positions: 0, workshops: 0 });

  // --- Logic: Fetch and count published forms from localStorage ---
  useEffect(() => {
    // 1. Read data from "Database"
    const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    
    // 2. Filter for Published only
    const publishedOnly = allForms.filter(f => f.status === 'published');

    // 3. Count by category
    const newCounts = {
      competitions: publishedOnly.filter(f => f.category === 'competitions').length,
      positions: publishedOnly.filter(f => f.category === 'positions').length,
      workshops: publishedOnly.filter(f => f.category === 'workshops').length,
    };

    setCounts(newCounts);
  }, []);

  const categories = [
    { 
      id: 'competitions', 
      title: { en: 'Competitions', ar: 'المسابقات' }, 
      available: counts.competitions, 
      description: { 
        en: 'Join our technical and creative challenges.', 
        ar: 'انضم إلى تحدياتنا التقنية والإبداعية.' 
      } 
    },
    { 
      id: 'positions', 
      title: { en: 'Apply for Position', ar: 'التقديم على منصب' }, 
      available: counts.positions, 
      description: { 
        en: 'Become a leader or a member in our offices.', 
        ar: 'كن قائداً أو عضواً في مكاتبنا المختلفة.' 
      } 
    },
    { 
      id: 'workshops', 
      title: { en: 'Workshop Attendance', ar: 'حضور ورش العمل' }, 
      available: counts.workshops, 
      description: { 
        en: 'Register for training in upcoming workshops.', 
        ar: 'سجل للحصول على تدريب في ورش العمل القادمة.' 
      } 
    },
  ];

  const pageTitle = language === 'ar' ? 'نماذج الطلاب' : 'Student Forms';

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: '#004a99', fontSize: '2.5rem' }}>{pageTitle}</h1>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#3b82f6', margin: '10px auto' }}></div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '25px',
        direction: language === 'ar' ? 'rtl' : 'ltr' 
      }}>
        {categories.map((cat) => (
          /* FIX: Added the 'key' prop here to stop the console error */
          <FormCard 
            key={cat.id} 
            title={cat.title[language]}
            available={cat.available}
            description={cat.description[language]} // Added description back so cards look good
            showDeadline={false} 
            btnLabel={language === 'ar' ? "استكشف الفرص" : "Explore Opportunities"}
            onClick={() => navigate(`/forms/category/${cat.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default FormsGallery;