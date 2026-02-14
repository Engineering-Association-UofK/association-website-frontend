import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import TeamSection from '../../components/TeamSection';
import { useGenerics } from '../../features/generics/hooks/useGenerics';
import EditGenericButton from '../../features/generics/components/EditGenericButton';
import './About.css';
import headerImg from '../../utils/images/about-page-header.jpg';
import img1 from '../../utils/images/img1.jpg';
import img2 from '../../utils/images/img2.jpg';

const About = () => {
    const { translations } = useLanguage();
    
    const keywords = [
        'home_about', 
        'about_mission', 
        'about_vision', 
        'about_goals', 
        'about_problems', 
        'about_achievements', 
        'about_message'
    ];

    const { data: generics, isLoading } = useGenerics(keywords);
    const getText = (key) => generics?.[key] || {};

    const renderHTML = (content) => {
        return { __html: content || '' };
    };

    return (
        <div className="about-page">
            <header className="w-100 mb-5 vh-100 overflow-hidden ">
                <img
                    src={headerImg}
                    alt="About Engineering Association"
                    className="w-100 h-auto shadow-sm"
                    style={{ display: 'block' }}
                />
            </header>

            {isLoading ? (
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="primary" />
                </Container>
            ) : (
            <Container className="py-5">
                <Row className="mb-5 text-center justify-content-center">
                    <Col lg={10}>
                        <h1 className="display-4 fw-bold mb-4">
                            {getText('home_about').title}
                            <EditGenericButton keyword="home_about" currentData={getText('home_about')} />
                        </h1>
                        <p className="lead text-muted w-75 mx-auto">
                            {getText('home_about').body}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5 align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <img src={img1} alt="Our Mission" className="img-fluid rounded shadow-sm hover-scale w-100" style={{ objectFit: 'cover', height: '300px' }} />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold mb-3">
                            {getText('about_mission').title}
                            <EditGenericButton keyword="about_mission" currentData={getText('about_mission')} />
                        </h2>
                        <p className="text-muted fs-5">
                            {getText('about_mission').body}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5 align-items-center">
                    <Col md={6}>
                        <h2 className="fw-bold mb-3">
                            {getText('about_vision').title}
                            <EditGenericButton keyword="about_vision" currentData={getText('about_vision')} />
                        </h2>
                        <p className="text-muted fs-5">
                            {getText('about_vision').body}
                        </p>
                    </Col>
                    <Col md={6} className="mb-4 mb-md-0">
                        <img src={img2} alt="Our Vision" className="img-fluid rounded shadow-sm hover-scale w-100" style={{ objectFit: 'cover', height: '300px' }} />
                    </Col>
                </Row>

                <div className="py-5">
                    <Row className="gy-4">
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">
                                {getText('about_goals').title || "Our Goals"}
                                <EditGenericButton keyword="about_goals" currentData={getText('about_goals')} />
                            </h2>
                            <div 
                                className="text-muted fs-5" 
                                dangerouslySetInnerHTML={renderHTML(getText('about_goals').body)} 
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">
                                {getText('about_problems').title || "Problems We Solve"}
                                <EditGenericButton keyword="about_problems" currentData={getText('about_problems')} />
                            </h2>
                            <div 
                                className="text-muted fs-5" 
                                dangerouslySetInnerHTML={renderHTML(getText('about_problems').body)} 
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">
                                {getText('about_achievements').title || "Achievements"}
                                <EditGenericButton keyword="about_achievements" currentData={getText('about_achievements')} />
                            </h2>
                            <div 
                                className="text-muted fs-5" 
                                dangerouslySetInnerHTML={renderHTML(getText('about_achievements').body)} 
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">
                                {getText('about_message').title || "Message to our visitors"}
                                <EditGenericButton keyword="about_message" currentData={getText('about_message')} />
                            </h2>
                            <p className="text-muted fs-5">
                                {getText('about_message').body}
                            </p>
                        </Col>
                    </Row>
                </div>

                <TeamSection />
            </Container>
            )}
        </div>
    );
};

export default About;
