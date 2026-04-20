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

            <Navbar variant="light" expand="lg" expanded={expanded} onToggle={setExpanded} className="shadow-sm py-2 sticky-top" style={{ background: language === 'ar' ? 'linear-gradient(270deg, #e0f7fa 0%, #ffffff 50%)' : 'linear-gradient(90deg, #e0f7fa 0%, #ffffff 50%)', zIndex: 1040 }}>
                <Container fluid className="px-3 px-lg-5 d-flex flex-wrap align-items-center">
                    {/* Logo */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-1 me-lg-4 py-0" onClick={() => setExpanded(false)}>
                        <img
                            src={language === 'ar' ? '/Logo-ar.png' : '/Logo-en.png'}
                            alt="Logo"
                            style={{ height: '40px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
                        />
                    </Navbar.Brand>

                    {/* Right side: Language + Login/Join + Hamburger (always visible) */}
                    <div className="d-flex align-items-center ms-auto gap-1 gap-lg-3 order-lg-last">
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="light"
                                id="dropdown-language"
                                className="rounded-pill px-2 px-lg-4 fw-bold shadow-sm border-0 bg-white"
                                style={{ color: '#22B2E6' }}
                            >
                                {currentLabel}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => switchLanguage('en')} active={language === 'en'}>English (EN)</Dropdown.Item>
                                <Dropdown.Item onClick={() => switchLanguage('ar')} active={language === 'ar'}>Arabic (AR)</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {user ? (
                            <button onClick={() => { logout(); setExpanded(false); }} className="btn fw-bold px-2 px-lg-3 py-1 py-lg-2 rounded-1 shadow-sm border-0" style={{ backgroundColor: '#22B2E6', color: 'white', whiteSpace: 'nowrap' }}>
                                {translations.navbar.logout}
                            </button>
                        ) : (
                            <Link to="/login" className="btn fw-bold px-2 px-lg-3 py-1 py-lg-2 rounded-1 shadow-sm border-0" onClick={() => setExpanded(false)} style={{ backgroundColor: '#22B2E6', color: 'white', whiteSpace: 'nowrap' }}>
                                {translations.navbar.login}
                            </Link>
                        )}

                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-0 ms-lg-1 px-1 px-lg-2" />
                    </div>

                    {/* Nav tabs - left side next to logo on desktop, drops below on mobile */}
                    <Navbar.Collapse id="basic-navbar-nav" className="order-last order-lg-0">
                        <Nav className="align-items-start align-items-lg-center py-3 py-lg-0 gap-lg-3">
                            <Nav.Link as={NavLink} to="/" end className="fw-medium text-dark" onClick={() => setExpanded(false)}>
                                {translations.navbar.home}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/about" className="fw-medium text-dark" onClick={() => setExpanded(false)}>
                                {translations.navbar.about}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/blogs" className="fw-medium text-dark" onClick={() => setExpanded(false)}>
                                {translations.navbar.blogs}
                            </Nav.Link>
                            {user?.type === 'admin' && (
                                <Nav.Link as={NavLink} to="/admin" className="fw-medium text-dark" onClick={() => setExpanded(false)}>
                                    {translations.navbar.admin}
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavigationBar;
