import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFacebook, faInstagram, faLinkedin, faXTwitter} from '@fortawesome/free-brands-svg-icons';
import { useGenerics } from '../features/generics/hooks/useGenerics';

const Footer = () => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';
    const alignClass = isRtl ? 'text-md-end' : 'text-md-start';

    const { data: generics } = useGenerics(['home_about']);
    const getText = (key) => generics?.[key] || {};

    return (
        <footer className="text-light py-5 mt-auto" style={{ backgroundColor: '#003366' }}>
            <Container>
                <Row className={`gy-4 text-center ${alignClass}`}>
                    {/* Brand & About */}
                    <Col lg={3} md={6}>
                        <h5 className="fw-bold mb-3">{translations.navbar.brand}</h5>
                        <p className="text-white-50">
                            {getText('home_about').body || "Loading about section..."}
                        </p>
                    </Col>

                    {/* Quick Links */}
                    <Col lg={3} md={6}>
                        <h5 className="fw-bold mb-3">{translations.footer.quickLinks}</h5>
                        <ul className="list-unstyled text-white-50">
                            <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none hover-white">{translations.navbar.home}</Link></li>
                            <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none hover-white">{translations.navbar.about}</Link></li>
                            <li className="mb-2"><Link to="/blogs" className="text-white-50 text-decoration-none hover-white">{translations.navbar.blogs}</Link></li>
                            <li className="mb-2"><Link to="/login" className="text-white-50 text-decoration-none hover-white">{translations.navbar.login}</Link></li>
                        </ul>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={3} md={6}>
                        <h5 className="fw-bold mb-3">{translations.footer.contact}</h5>
                        <ul className="list-unstyled text-white-50">
                            <li className="mb-2">{translations.footer.email}: sea@uofk.edu</li>
                            <li className="mb-2">{translations.footer.phone}: +123 456 7890</li>
                            <li>{translations.footer.locationName}: {translations.footer.location}</li>
                        </ul>
                    </Col>

                    {/* Newsletter & Socials */}
                    <Col lg={3} md={6}>
                        <h6 className="fw-bold mb-3 mt-4">{translations.footer.follow}</h6>
                        <div className={`d-flex gap-3 justify-content-center justify-content-md-start`}>
                            <a href="https://www.facebook.com/UofKHandasa/about/" className="text-light fs-5 hover-opacity" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="https://x.com/UofK_Handasa" className="text-light fs-5 hover-opacity" rel="noopener noreferrer"><FontAwesomeIcon icon={faXTwitter} /></a>
                            <a href="https://www.instagram.com/uofk__handasa/" className="text-light fs-5 hover-opacity" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="https://www.linkedin.com/company/engineering-association-uofk/" className="text-light fs-5 hover-opacity" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4 border-light opacity-25" />

                <Row className="text-center text-white-50 small">
                    <Col md={6} className={alignClass}>
                        &copy; {new Date().getFullYear()} {translations.navbar.brand}. {translations.footer.rights}
                    </Col>
                    {/*<Col md={6} className={isRtl ? 'text-md-start' : 'text-md-end'}>*/}
                    {/*    <a href="#" className="text-white-50 text-decoration-none me-3">{translations.footer.privacy}</a>*/}
                    {/*    <a href="#" className="text-white-50 text-decoration-none">{translations.footer.terms}</a>*/}
                    {/*</Col>*/}
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
