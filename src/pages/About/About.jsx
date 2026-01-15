import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import TeamSection from '../../components/TeamSection';
import './About.css';
import headerImg from '../../utils/images/about-page-header.jpg';
import img1 from '../../utils/images/img1.jpg';
import img2 from '../../utils/images/img2.jpg';

const About = () => {
    const { translations } = useLanguage();

    return (
        <div className="about-page">
            <header className="w-100 mb-5">
                <img
                    src={headerImg}
                    alt="About Engineering Association"
                    className="w-100 h-auto shadow-sm"
                    style={{ display: 'block' }}
                />
            </header>

            <Container className="py-5">
                <Row className="mb-5 text-center justify-content-center">
                    <Col lg={10}>
                        <h1 className="display-4 fw-bold mb-4">{translations.about.title}</h1>
                        <p className="lead text-muted w-75 mx-auto">
                            {translations.home.about.description}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5 align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <img src={img1} alt="Our Mission" className="img-fluid rounded shadow-sm hover-scale w-100" style={{ objectFit: 'cover', height: '300px' }} />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold mb-3">{translations.about.mission}</h2>
                        <p className="text-muted fs-5">
                            {translations.about.missionText}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5 align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <img src={img2} alt="Our Vision" className="img-fluid rounded shadow-sm hover-scale w-100" style={{ objectFit: 'cover', height: '300px' }} />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold mb-3">{translations.about.vision}</h2>
                        <p className="text-muted fs-5">
                            {translations.about.visionText}
                        </p>
                    </Col>
                </Row>

                <div className="py-5">
                    <Row className="gy-4">
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">Our Goals</h2>
                            <ul className="text-muted fs-5">
                                <li>Promote engineering excellence and innovation among students.</li>
                                <li>Foster strong collaboration between academic environment and industry.</li>
                                <li>Provide resources and mentorship for aspiring engineers.</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">Problems We Solve</h2>
                            <ul className="text-muted fs-5">
                                <li>Bridging the gap between theory and practice.</li>
                                <li>Creating networking opportunities for students.</li>
                                <li>Providing access to industry standards and trends.</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">Achievements</h2>
                            <ul className="text-muted fs-5">
                                <li>Organized over 50 technical workshops.</li>
                                <li>Connected 500+ students with internships.</li>
                                <li>Awarded "Best Student Association" for 3 years.</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">Message to our visitors</h2>
                            <p className="text-muted fs-5">
                                Welcome to our vibrant community of innovators. We strive to create an environment where creativity meets technical expertise. Join us in shaping the future of engineering.
                            </p>
                        </Col>
                    </Row>
                </div>

                <TeamSection />
            </Container>
        </div>
    );
};

export default About;
