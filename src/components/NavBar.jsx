import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ADMIN_ROLES } from '../utils/roles';

const NavigationBar = () => {
    const { translations, switchLanguage, language } = useLanguage();

    // --- Desktop dropdown hover state (for "About" menu) ---
    const [showAboutDropdown, setShowAboutDropdown] = useState(false);
    let timeoutId;

    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
        setShowAboutDropdown(true);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => setShowAboutDropdown(false), 150);
    };

    const currentLabel = language === 'en' ? 'EN' : 'AR';
    const { user, logout } = useAuth();

    // expanded = whether the mobile navbar collapse is open (used for mobile backdrop & body scroll lock)
    const [expanded, setExpanded] = useState(false);
    const isAdmin = user?.roles?.some((r) => ADMIN_ROLES.includes(r));

    // MOBILE: When the collapsed navbar is open, prevent body scrolling and show a dark backdrop.
    useEffect(() => {
        if (expanded) {
            document.body.style.overflow = 'hidden'; // lock background scroll
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [expanded]);

    // MOBILE: Detect if viewport is desktop (>=992px) to switch between hover dropdown and stacked links.
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Desktop version of About dropdown (hover‑based, absolute positioned) ---
    const DesktopAboutDropDown = () => {
        return (
            <div className="mx-2 position-relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className={`fw-medium text-white text-center ${language === 'ar' ? 'text-end' : ''}`} style={{ cursor: 'pointer', padding: '0.5rem 0', display: 'inline-block', width: '100%' }}>
                    {translations.navbar.about}
                </div>
                {showAboutDropdown && (
                    <div className="position-absolute mt-2 shadow-sm rounded-3 custom-about-dropdown" style={{ zIndex: 1050, right: language === 'ar' ? 'auto' : '0', left: language === 'ar' ? '0' : 'auto', transform: language === 'ar' ? 'translateX(-40%)' : 'translateX(40%)', backgroundColor: '#0c64bb' }}>
                        <NavLink to="/about/association" end className="dropdown-item-custom" onClick={() => { setExpanded(false); setShowAboutDropdown(false); }}>
                            {translations.navbar.association}
                        </NavLink>
                        <NavLink to="/about/oraganizationStructure" className="dropdown-item-custom" onClick={() => { setExpanded(false); setShowAboutDropdown(false); }}>
                            {translations.navbar.oraganizationStructure}
                        </NavLink>
                        <NavLink to="/about/thirtiethCouncil" className="dropdown-item-custom" onClick={() => { setExpanded(false); setShowAboutDropdown(false); }}>
                            {translations.navbar.thirtiethCouncil}
                        </NavLink>
                    </div>
                )}
            </div>
        );
    };

    // --- MOBILE: About menu becomes a vertical list of Nav.Link elements inside the collapsed navbar.
    // This avoids hover complexity on touch devices and makes tapping easier.
    const MobileAboutDropDown = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Nav.Link as={NavLink} to="/about/association" end className="mx-2 fw-medium text-white" onClick={() => setExpanded(false)}>
                    {translations.navbar.association}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about/oraganizationStructure" end className="mx-2 fw-medium text-white" onClick={() => setExpanded(false)}>
                    {translations.navbar.oraganizationStructure}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about/thirtiethCouncil" end className="mx-2 fw-medium text-white" onClick={() => setExpanded(false)}>
                    {translations.navbar.thirtiethCouncil}
                </Nav.Link>
            </div>
        );
    };

    return (
        <>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 0.5; }
                }
                .custom-about-dropdown {
                    border: none !important;
                    min-width: 180px;
                    text-align: center;
                }
                .custom-about-dropdown .dropdown-item-custom {
                    color: #ffffff !important;
                    text-align: center;
                    padding: 0.5rem 1rem;
                    transition: background 0.2s;
                    display: block;
                    text-decoration: none;
                }
                .custom-about-dropdown .dropdown-item-custom:hover,
                .custom-about-dropdown .dropdown-item-custom:focus {
                    background-color: #0d6efd !important;
                    color: #ffffff !important;
                    border-radius: 0.25rem;
                }
                .custom-about-dropdown .dropdown-item-custom.active {
                    background-color: #0d6efd !important;
                    color: #ffffff !important;
                }
            `}
            </style>

            {/* Backdrop for mobile menu */}
            {/* 
                MOBILE: Dark semi‑transparent backdrop that appears when the collapsed navbar is open.
                Clicking it closes the navbar (sets expanded = false). 
            */}
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

                    {/* 
                        MOBILE: Language switcher and hamburger toggle are placed on the right side.
                        The language dropdown is only visible on small screens (d-lg-none). 
                    */}
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

                        {/* MOBILE: The hamburger button that toggles the collapsed menu. */}
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </div>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center py-3 py-lg-0">
                            <Nav.Link as={NavLink} to="/" end className="mx-2 fw-medium text-white" onClick={() => setExpanded(false)}>
                                {translations.navbar.home}
                            </Nav.Link>

                            {/* 
                                MOBILE: Conditional rendering based on screen width.
                                - Desktop (>992px) uses a hover dropdown (DesktopAboutDropDown).
                                - Mobile (≤992px) uses a simple vertical list (MobileAboutDropDown) inside the collapsed navbar.
                                This ensures touch‑friendly navigation on small devices. 
                            */}
                            { isDesktop ? <DesktopAboutDropDown /> : <MobileAboutDropDown /> }

                            <Nav.Link as={NavLink} to="/blogs" className="mx-2 fw-medium" onClick={() => setExpanded(false)}>
                                {translations.navbar.blogs}
                            </Nav.Link>

                            {isAdmin && (
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

                            {/* Desktop language switcher (hidden on mobile). */}
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
