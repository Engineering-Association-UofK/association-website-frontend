import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const { translations } = useLanguage();

    return (
        <footer className="bg-dark text-light py-5 mt-auto">
            <Container>
                <Row>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5>{translations.navbar.brand}</h5>
                        <p className="text-muted">
                            {translations.home.about.description}
                        </p>
                    </Col>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5>{translations.footer.contact}</h5>
                        <ul className="list-unstyled text-muted">
                            <li>Email: contact@esa-university.edu</li>
                            <li>Phone: +123 456 7890</li>
                            <li>Location: Engineering Building, Main Campus</li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5>{translations.footer.follow}</h5>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-light fs-4"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="#" className="text-light fs-4"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="#" className="text-light fs-4"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" className="text-light fs-4"><FontAwesomeIcon icon={faLinkedin} /></a>
                        </div>
                    </Col>
                </Row>
                <hr className="my-4 border-secondary" />
                <div className="text-center text-muted">
                    <small>&copy; {new Date().getFullYear()} {translations.navbar.brand}. {translations.footer.rights}</small>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
