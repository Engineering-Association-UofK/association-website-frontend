import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext.jsx';
import headerImg from '../../utils/images/home-page-header.jpg';
import { Link } from "react-router-dom";
import './HeroSection.css';

const HeroSection = () => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <section className={`hero-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
            {/* Background Layer */}
            <div 
                className="hero-bg" 
                style={{ backgroundImage: `url(${headerImg})` }} 
            />
            
            <div className="hero-overlay" />

            <Container className="hero-container">
                <div className="hero-content">
                    <div className="hero-badge animate-fade-in">
                        {translations.home.hero.badge}
                    </div>
                    
                    <h1 className="hero-title animate-slide-up">
                        {translations.home.hero.title}
                    </h1>
                    
                    <p className="hero-subtitle animate-slide-up-delayed">
                        {translations.home.hero.subtitle}
                    </p>
                    
                    <div className="hero-actions animate-fade-in-delayed">
                        <Button 
                            as={Link} 
                            to="/about/association" 
                            className="hero-btn-primary"
                        >
                            {translations.home.hero.cta}
                        </Button>
                        <Button 
                            as={Link} 
                            to="/about/thirtiethCouncil" 
                            className="hero-btn-outline"
                        >
                            {translations.home.hero.secondaryCta}
                        </Button>
                    </div>
                </div>
            </Container>

            <div className="hero-bottom-shape" />
        </section>
    );
};

export default HeroSection;