import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NavigationBar = () => {
    const { translations, switchLanguage, language } = useLanguage();

    const handleLanguageToggle = () => {
        switchLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <Navbar variant="dark" expand="lg" className="shadow-sm py-3 sticky-top" style={{ backgroundColor: '#003366' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-white fs-3 d-flex align-items-center">
                    <img
                        src="/favicon.ico"
                        alt="Logo"
                        className="me-2 rounded-circle bg-white p-1"
                        style={{ width: '40px', height: '40px' }}
                    />
                    {translations.navbar.brand}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to="/" end className="mx-2 fw-medium text-white">
                            {translations.navbar.home}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className="mx-2 fw-medium text-white">
                            {translations.navbar.about}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/login" className="mx-2 fw-medium text-white">
                            {translations.navbar.login}
                        </Nav.Link>
                        <Button
                            variant="light"
                            className="ms-lg-3 mt-3 mt-lg-0 rounded-pill px-4 fw-bold shadow-sm text-primary"
                            onClick={handleLanguageToggle}
                        >
                            {translations.navbar.language}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
