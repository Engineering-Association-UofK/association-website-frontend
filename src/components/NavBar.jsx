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
        <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3 d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                        SEA
                    </div>
                    {translations.navbar.brand}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to="/" end className="mx-2 fw-medium">
                            {translations.navbar.home}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className="mx-2 fw-medium">
                            {translations.navbar.about}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/initiatives" className="mx-2 fw-medium">
                            {translations.navbar.initiatives}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/news" className="mx-2 fw-medium">
                            {translations.navbar.news}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/forms" className="mx-2 fw-medium">
                            {translations.navbar.forms}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/login" className="mx-2 fw-medium">
                            {translations.navbar.login}
                        </Nav.Link>
                        <Button
                            variant="primary"
                            className="ms-lg-3 mt-3 mt-lg-0 rounded-pill px-4 fw-bold shadow-sm"
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
