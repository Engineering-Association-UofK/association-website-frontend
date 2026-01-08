import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const { translations } = useLanguage();

    return (
        <footer className="text-light py-5 mt-auto" style={{ backgroundColor: '#003366' }}>
            <Container>
                <Row className="gy-4 text-center text-md-start">
                    <Col md={4}>
                        <h5 className="fw-bold mb-3">{translations.navbar.brand}</h5>
                        <p className="text-white-50">
                            {translations.home.about.description}
                        </p>
                    </Col>
                    <Col md={4}>
                        <h5 className="fw-bold mb-3">{translations.footer.contact}</h5>
                        <ul className="list-unstyled text-white-50">
                            <li className="mb-2">Email: contact@esa-university.edu</li>
                            <li className="mb-2">Phone: +123 456 7890</li>
                            <li>Location: Engineering Building, Main Campus</li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5 className="fw-bold mb-3">{translations.footer.follow}</h5>
                        <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                            <a href="#" className="text-light fs-4 hover-opacity"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="#" className="text-light fs-4 hover-opacity"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="#" className="text-light fs-4 hover-opacity"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" className="text-light fs-4 hover-opacity"><FontAwesomeIcon icon={faLinkedin} /></a>
                        </div>
                    </Col>
                </Row>
                <hr className="my-4 border-light opacity-25" />
                <div className="text-center text-white-50">
                    <small>&copy; {new Date().getFullYear()} {translations.navbar.brand}. {translations.footer.rights}</small>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
