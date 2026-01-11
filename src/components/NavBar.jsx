import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {
    const { translations, switchLanguage, language } = useLanguage();

    // Helper to get current label
    const currentLabel = language === 'en' ? 'EN' : 'AR';

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

                <div className="d-flex align-items-center order-lg-last ms-auto ms-lg-0">
                    {/* Mobile Language Button */}
                    <Dropdown className="d-lg-none me-2">
                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-language-mobile"
                            className="rounded-pill px-3 fw-bold shadow-sm text-primary"
                            size="sm"
                        >
                            {currentLabel}
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => switchLanguage('en')} active={language === 'en'}>English (EN)</Dropdown.Item>
                            <Dropdown.Item onClick={() => switchLanguage('ar')} active={language === 'ar'}>Arabic (AR)</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to="/" end className="mx-2 fw-medium text-white">
                            {translations.navbar.home}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className="mx-2 fw-medium text-white">
                            {translations.navbar.about}
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/news" className="mx-2 fw-medium">
                            {translations.navbar.news}
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/admin" className="mx-2 fw-medium">
                            {translations.navbar.admin}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/login" className="mx-2 fw-medium">
                            {translations.navbar.login}
                        </Nav.Link>

                        {/* Desktop Language Button */}
                        <Dropdown className="d-none d-lg-block ms-lg-3">
                            <Dropdown.Toggle
                                variant="light"
                                id="dropdown-language-desktop"
                                className="rounded-pill px-4 fw-bold shadow-sm text-primary"
                            >
                                {currentLabel}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => switchLanguage('en')} active={language === 'en'}>English (EN)</Dropdown.Item>
                                <Dropdown.Item onClick={() => switchLanguage('ar')} active={language === 'ar'}>Arabic (AR)</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
