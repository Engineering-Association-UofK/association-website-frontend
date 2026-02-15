import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext.jsx';
import headerImg from '../../utils/images/home-page-header.jpg';
import {Link} from "react-router-dom";

const HeroSection = () => {
    const { translations } = useLanguage();

    return (
        <header className="position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '100vh' }}>
            <div
                className="position-absolute top-0 start-0 w-100 h-100 z-0"
                style={{ 
                    backgroundImage: `url(${headerImg})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            ></div>

            <div
                className="position-absolute top-0 start-0 w-100 h-100 z-1" 
                style={{ 
                    background: 'linear-gradient(135deg, rgba(0, 51, 102, 0.85) 0%, rgba(0, 0, 0, 0.6) 100%)',
                    pointerEvents: 'none' 
                }}
            ></div>

            <Container className="position-relative z-2 text-center text-white">
                <h1 className="display-4 display-md-2 fw-bold mb-4 text-shadow">{translations.home.hero.title}</h1>
                <p className="lead mb-5 fs-5 fs-md-3 text-shadow opacity-90">{translations.home.hero.subtitle}</p>
                <Button as={Link} to="/about" variant="primary" size="lg" className="rounded-pill px-5 py-3 fs-5 fw-bold shadow-lg hover-scale">
                    {translations.home.hero.cta}
                </Button>
            </Container>
        </header>
    );
};

export default HeroSection;