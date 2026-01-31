import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from './formcard'; 
import { useLanguage } from '../../context/LanguageContext'; // Matches their export

function FormsGallery() {
  const navigate = useNavigate();
  // We pull 'language' from their context
  const { language } = useLanguage(); 

  const categories = [
    { 
      id: 'competitions', 
      title: { en: 'Competitions', ar: 'المسابقات' }, 
      available: 2, 
      description: { 
        en: 'Join our technical and creative challenges.', 
        ar: 'انضم إلى تحدياتنا التقنية والإبداعية.' 
      } 
    },
    { 
      id: 'positions', 
      title: { en: 'Apply for Position', ar: 'التقديم على منصب' }, 
      available: 5, 
      description: { 
        en: 'Become a leader or a member in our offices.', 
        ar: 'كن قائداً أو عضواً في مكاتبنا المختلفة.' 
      } 
    },
    { 
      id: 'workshops', 
      title: { en: 'Workshop Attendance', ar: 'حضور ورش العمل' }, 
      available: 1, 
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
        // Their context already handles document.dir, but we ensure layout follows
        direction: language === 'ar' ? 'rtl' : 'ltr' 
      }}>
        {categories.map((cat) => (
          <FormCard 
            key={cat.id} 
            title={cat.title[language]} 
            available={cat.available} 
            description={cat.description[language]}
            onClick={() => navigate(`/forms/${cat.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default FormsGallery;