import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
    const { translations, switchLanguage, language } = useLanguage();

    const currentLabel = language === 'en' ? 'EN' : 'AR';
    const { user, logout } = useAuth();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (expanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [expanded]);

    return (
        <>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 0.5; }
                }
            `}
            </style>
            {/* Backdrop for mobile menu */}
            {expanded && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                    style={{ zIndex: 1035, opacity: 0.5, animation: 'fadeIn 0.3s ease-out' }}
                    onClick={() => setExpanded(false)}
                />
            )}

            <Navbar variant="dark" expand="lg" expanded={expanded} onToggle={setExpanded} className="shadow-sm py-3 sticky-top" style={{ backgroundColor: '#003366', zIndex: 1040 }}>
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-white fs-4 fs-lg-3 d-flex align-items-center" onClick={() => setExpanded(false)}>
                        <img
                            src="/favicon.ico"
                            alt="Logo"
                            className="me-2 rounded-circle bg-white p-1"
                            style={{ width: '32px', height: '32px' }}
                        />
                        {translations.navbar.brand}
                    </Navbar.Brand>

                    <div className="d-flex align-items-center order-lg-last ms-auto ms-lg-0 gap-2">
                        <Dropdown className="d-lg-none">
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
                        <Nav className="ms-auto align-items-center py-3 py-lg-0">
                            <Nav.Link as={NavLink} to="/" end className="mx-2 fw-medium text-white" onClick={() => setExpanded(false)}>
                                {translations.navbar.home}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/about" className="mx-2 fw-medium text-white" onClick={() => setExpanded(false)}>
                                {translations.navbar.about}
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/blogs" className="mx-2 fw-medium" onClick={() => setExpanded(false)}>
                                {translations.navbar.blogs}
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/secretariats" className="mx-2 fw-medium" onClick={() => setExpanded(false)}>
                                {translations.navbar.secretariats}
                            </Nav.Link>

                            {user?.role === 'admin' && (
                                <Nav.Link as={NavLink} to="/admin" className="mx-2 fw-medium" onClick={() => setExpanded(false)}>
                                    {translations.navbar.admin}
                                </Nav.Link>
                            )}

                            {user ? (
                                <Nav.Link onClick={() => { logout(); setExpanded(false); }} className="mx-2 fw-medium" style={{ cursor: 'pointer' }}>
                                    {translations.navbar.logout}
                                </Nav.Link>
                            ) : (
                                <Nav.Link as={NavLink} to="/login" className="mx-2 fw-medium" onClick={() => setExpanded(false)}>
                                    {translations.navbar.login}
                                </Nav.Link>
                            )}

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
        </>
    );
};

export default NavigationBar;
