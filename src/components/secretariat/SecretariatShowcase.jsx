import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaNewspaper, FaGraduationCap, FaFutbol, FaGlobe, 
  FaPalette, FaHandsHelping, FaChartLine, FaSitemap,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import './SecretariatShowcase.css';

const SecretariatShowcase = () => {
  const { translations, language } = useLanguage();
  const isRtl = language === 'ar';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const secretariats = [
    { id: 'media', icon: FaNewspaper, accentColor: '#667eea' },
    { id: 'academic', icon: FaGraduationCap, accentColor: '#f5576c' },
    { id: 'sports', icon: FaFutbol, accentColor: '#4facfe' },
    { id: 'external', icon: FaGlobe, accentColor: '#43e97b' },
    { id: 'cultural', icon: FaPalette, accentColor: '#fa709a' },
    { id: 'social', icon: FaHandsHelping, accentColor: '#a18cd1' },
    { id: 'financial', icon: FaChartLine, accentColor: '#fcb69f' },
    { id: 'general', icon: FaSitemap, accentColor: '#ff9a9e' },
  ];

  const total = secretariats.length;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  const getPositionClass = (index) => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex - 1 + total) % total) return 'left';
    if (index === (activeIndex + 1) % total) return 'right';
    return 'hidden';
  };

  return (
    <Container 
      fluid 
      className={`showcase-container ${isRtl ? 'rtl' : 'ltr'}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="showcase-title">
        <h2>{translations.secretariats?.title || 'أمانات الجمعية'}</h2>
        <div className="title-underline" />
      </div>

      <div className="carousel-wrapper">
        <button className="nav-arrow nav-arrow-left" onClick={handlePrev}>
          {isRtl ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        
        <button className="nav-arrow nav-arrow-right" onClick={handleNext}>
          {isRtl ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        <div className="cards-viewport">
          {secretariats.map((sec, index) => {
            const Icon = sec.icon;
            const pos = getPositionClass(index);
            const name = translations.secretariats?.[sec.id]?.name || sec.id;
            const desc = translations.secretariats?.[sec.id]?.desc || "";

            return (
              <div key={sec.id} className={`secretariat-card ${pos}`}>
                <div className="card-accent" style={{ backgroundColor: sec.accentColor }} />
                <div className="card-content">
                  <div className="card-icon" style={{ color: sec.accentColor }}><Icon /></div>
                  <h3 className="card-title">{name}</h3>
                  
                  {/* We render the full text but use CSS to mask/clamp it for side cards */}
                  <div className="card-description-wrapper">
                    <p className="card-description">{desc}</p>
                  </div>

                  <Link to="/about/oraganizationStructure" className="read-more-btn">
                    {translations.secretariats?.readMore || 'Read More'} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-dots">
        {secretariats.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
    </Container>
  );
};

export default SecretariatShowcase;