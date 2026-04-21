import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import img from '../../utils/images/img1.jpg';
import './AboutSection.css';

const AboutSection = () => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <section className={`about-section ${isRtl ? 'rtl' : 'ltr'}`}>
            <Container>
                <Row className="align-items-center">
                    {/* Text Content */}
                    <Col lg={6} className="mb-5 mb-lg-0">
                        <div className="about-content">
                            <span className="section-badge">
                                {translations.home.about.badge || 'Since 19XX'}
                            </span>
                            <h2 className="display-5 fw-bold mb-4">
                                {translations.home.about.title}
                            </h2>
                            <p className="about-description">
                                {translations.home.about.subtitle}
                            </p>
                            <div className="about-features">
                                <div className="feature-item">
                                    <div className="feature-dot" />
                                    <span>{translations.home.about.feature1}</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-dot" />
                                    <span>{translations.home.about.feature2}</span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Visual Element */}
                    <Col lg={6}>
                        <div className="main-image-container">
                            <img 
                                src={img} 
                                alt="About Us" 
                                className="about-main-image"
                            />
                            <div className="experience-card">
                                <span className="exp-number">25+</span>
                                <span className="exp-text">Years of Impact</span>
                            </div>
                        </div>
                        <div className="image-decoration" />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutSection;