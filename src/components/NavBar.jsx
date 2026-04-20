import React, { useState, useEffect, useRef } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Offcanvas,
} from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ADMIN_ROLES } from '../utils/roles';

const NavigationBar = () => {
  const { translations, switchLanguage, language } = useLanguage();
  const { user, logout } = useAuth();
  const isAdmin = user?.roles?.some((r) => ADMIN_ROLES.includes(r));

  // Offcanvas state
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  // Lock body scroll when offcanvas is open
  useEffect(() => {
    document.body.style.overflow = showOffcanvas ? 'hidden' : 'unset';
  }, [showOffcanvas]);

  // Hover timeout for desktop dropdowns
  const timeoutRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownMouseEnter = (key) => {
    clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const currentLabel = language === 'en' ? 'English' : 'العربية';

  // Desktop dropdown renderer
  const renderDesktopDropdown = (title, items, dropdownKey) => (
    <Dropdown
      show={openDropdown === dropdownKey}
      onMouseEnter={() => handleDropdownMouseEnter(dropdownKey)}
      onMouseLeave={handleDropdownMouseLeave}
      className="mx-2"
    >
      <Dropdown.Toggle
        variant="link"
        className="fw-medium text-dark text-decoration-none p-0 border-0"
        style={{ boxShadow: 'none' }}
      >
        {title}
      </Dropdown.Toggle>

      <Dropdown.Menu
        align={language === 'ar' ? 'start' : 'end'}
        className="shadow-sm border-0 rounded-3 py-2"
        style={{ minWidth: '200px' }}
      >
        {items.map((item, idx) => (
          <Dropdown.Item
            key={idx}
            as={NavLink}
            to={item.to}
            end={item.end}
            className="py-2 px-3 text-center"
            style={{ color: '#333' }}
            onClick={() => setOpenDropdown(null)}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  // Mobile collapsible section
  const MobileCollapsibleSection = ({ title, items }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="w-100">
        <div
          className="d-flex justify-content-between align-items-center px-2 py-2"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          <span className="fw-bold text-muted text-uppercase small">{title}</span>
          <i className={`bi bi-chevron-${open ? 'up' : 'down'}`}></i>
        </div>
        {open && (
          <div className="ps-3">
            {items.map((item, idx) => (
              <Nav.Link
                key={idx}
                as={NavLink}
                to={item.to}
                end={item.end}
                className="fw-medium text-dark py-2"
                onClick={handleClose}
              >
                {item.label}
              </Nav.Link>
            ))}
          </div>
        )}
        <hr className="my-2" />
      </div>
    );
  };

  // Define dropdown items
  const aboutItems = [
    { to: '/about/association', end: true, label: translations.navbar.association },
    { to: '/about/oraganizationStructure', label: translations.navbar.oraganizationStructure },
    { to: '/about/thirtiethCouncil', label: translations.navbar.thirtiethCouncil },
  ];

  const postsItems = [
    { to: '/posts/news', label: 'News' },
    { to: '/posts/events', label: 'Events' },
    { to: '/posts/announcements', label: 'Announcements' },
    { to: '/posts/resources', label: 'Resources' },
  ];

  return (
    <>
      <style>
        {`
          @media (min-width: 992px) {
            .dropdown:hover .dropdown-menu {
              display: block;
              margin-top: 0;
            }
            .dropdown-toggle::after {
              display: inline-block;
              margin-left: 0.255em;
              vertical-align: 0.255em;
              content: "";
              border-top: 0.3em solid;
              border-right: 0.3em solid transparent;
              border-bottom: 0;
              border-left: 0.3em solid transparent;
            }
          }
          .nav-link.active, .dropdown-item.active {
            background-color: #22B2E6 !important;
            color: white !important;
          }
          .dropdown-item:active {
            background-color: #22B2E6 !important;
          }
          /* Make desktop nav horizontal */
          .desktop-nav {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
          }
        `}
      </style>

      <Navbar expand={false} className="shadow-sm py-2 sticky-top bg-white border-bottom">
        <Container fluid className="px-3 px-lg-5 gap-lg-3">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="me-1 me-lg-4 py-0">
            <img
              src={language === 'ar' ? '/Logo-ar.png' : '/Logo-en.png'}
              alt="Logo"
              style={{ height: '45px', width: 'auto', objectFit: 'contain' }}
            />
          </Navbar.Brand>

          {/* DESKTOP NAVIGATION - Hidden on mobile, horizontal layout */}
          <div className="d-none d-lg-flex align-items-center desktop-nav">
            <Nav.Link as={NavLink} to="/" end className="fw-medium text-dark">
              {translations.navbar.home}
            </Nav.Link>
            {renderDesktopDropdown(translations.navbar.about, aboutItems, 'about')}
            {renderDesktopDropdown(translations.navbar.blogs, postsItems, 'posts')}
            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin" className="fw-medium text-dark">
                {translations.navbar.admin}
              </Nav.Link>
            )}
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center ms-auto gap-3 gap-lg-4">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="text-decoration-none fw-bold p-0 border-0 d-flex align-items-center"
                style={{ color: '#22B2E6', fontSize: '0.95rem' }}
              >
                <i className="bi bi-translate me-1"></i> {currentLabel}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => switchLanguage('en')} active={language === 'en'}>
                  English (EN)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => switchLanguage('ar')} active={language === 'ar'}>
                  Arabic (AR)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <div className="d-none d-lg-block">
              {user ? (
                <button
                  onClick={logout}
                  className="btn fw-bold px-4 py-2 rounded-1 shadow-sm border-0 text-white"
                  style={{ backgroundColor: '#22B2E6' }}
                >
                  {translations.navbar.logout}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn fw-bold px-4 py-2 rounded-1 shadow-sm border-0 text-white"
                  style={{ backgroundColor: '#22B2E6' }}
                >
                  {translations.navbar.login}
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <Navbar.Toggle
              aria-controls="offcanvasNavbar"
              onClick={handleShow}
              className="d-lg-none ms-0 px-2 border-0 shadow-none"
            />
          </div>

          {/* MOBILE OFFCANVAS */}
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement={language === 'ar' ? 'start' : 'end'}
            show={showOffcanvas}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title className="fw-bold" style={{ color: '#22B2E6' }}>
                {translations.navbar.brand}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
              <Nav className="flex-column gap-1">
                <Nav.Link as={NavLink} to="/" end className="fw-medium text-dark fs-5" onClick={handleClose}>
                  {translations.navbar.home}
                </Nav.Link>
                <MobileCollapsibleSection title={translations.navbar.about} items={aboutItems} />
                <MobileCollapsibleSection title={translations.navbar.blogs} items={postsItems} />
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/admin" className="fw-medium text-dark fs-5" onClick={handleClose}>
                    {translations.navbar.admin}
                  </Nav.Link>
                )}
              </Nav>

              <div className="mt-auto pt-4 border-top">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      handleClose();
                    }}
                    className="btn w-100 fw-bold py-3 rounded-2 shadow-sm border-0 text-white"
                    style={{ backgroundColor: '#22B2E6' }}
                  >
                    {translations.navbar.logout}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="btn w-100 fw-bold py-3 rounded-2 shadow-sm border-0 text-white"
                    onClick={handleClose}
                    style={{ backgroundColor: '#22B2E6' }}
                  >
                    {translations.navbar.login}
                  </Link>
                )}
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;