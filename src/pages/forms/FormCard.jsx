// src/pages/forms/FormCard.jsx
import React from 'react';

function FormCard({ title, available, description, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #eee',
        cursor: 'pointer',
        transition: 'all 0.3s ease-out',
        position: 'relative',
        textAlign: 'left' // Keeps text aligned professionaly
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px)';
        e.currentTarget.style.borderColor = '#004a99';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,74,153,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#eee';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      }}
    >
      {/* Small Green Available Forms Mark */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#f0fdf4',
        padding: '4px 10px',
        borderRadius: '12px',
        border: '1px solid #bbf7d0'
      }}>
        <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
        <span style={{ color: '#166534', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {available} Available
        </span>
      </div>

      <h3 style={{ color: '#004a99', marginBottom: '12px', marginTop: '10px' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '25px', minHeight: '40px' }}>
        {description}
      </p>
      
      <button 
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: '#004a99',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003366'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004a99'}
      >
        Explore Opportunities
      </button>
    </div>
  );
}

export default FormCard;