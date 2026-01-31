// src/pages/forms/FormsGallery.jsx
// src/pages/forms/FormsGallery.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from './formcard'; // IMPORT your new Lego piece

function FormsGallery() {
  const navigate = useNavigate();

  // If the leader wants a new category, they just add one dictionary here!
  const categories = [
    { id: 'competitions', title: 'Competitions', available: 2, description: 'Join our technical challenges .' },
    { id: 'positions', title: 'Apply for Position', available: 5, description: 'Become a leader or a member in our offices' },
    { id: 'workshops', title: 'Workshop Attendance', available: 1, description: 'Register for training in upcoming workshops.' },
  ];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: '#004a99', fontSize: '2.5rem' }}>Student Forms</h1>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#3b82f6', margin: '10px auto' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
        {categories.map((cat) => (
          <FormCard 
            key={cat.id} 
            title={cat.title} 
            available={cat.available} 
            description={cat.description}
            onClick={() => navigate(`/forms/${cat.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default FormsGallery;