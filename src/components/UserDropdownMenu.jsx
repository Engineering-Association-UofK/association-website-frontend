import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './UserDropdownMenu.css';

const UserDropdownMenu = ({ isMobile = false, onItemClick }) => {
  const { user, logout } = useAuth();
  const { translations, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user display name based on language
  const displayName = language === 'ar'
    ? (user?.name_ar || user?.name_en || '')
    : (user?.name_en || user?.name_ar || '');

  // Generate initials from name
  const getInitials = () => {
    const name = user?.name_en || user?.name_ar || '';
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0]?.toUpperCase() || '?';
  };

  const avatarUrl = user?.avatar_url;
  const initials = getInitials();
  const menuItems = translations.navbar?.userMenu || {};

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    if (onItemClick) onItemClick();
    navigate('/');
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onItemClick) onItemClick();
  };

  // Avatar element (reused)
  const AvatarCircle = ({ size = 'default', className = '' }) => (
    <div className={`${size === 'large' ? 'user-dropdown-header-avatar' : size === 'mobile' ? 'mobile-user-avatar' : 'user-avatar'} ${className}`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={displayName} />
      ) : (
        initials
      )}
    </div>
  );

  // ─── Mobile Layout ───
  if (isMobile) {
    return (
      <div className="mobile-user-section">
        <div className="mobile-user-header">
          <AvatarCircle size="mobile" />
          <div className="mobile-user-info">
            <div className="mobile-user-name">{displayName || 'User'}</div>
            <div className="mobile-user-role">
              {user?.roles?.[0]?.replace('sys:', '').replace('_', ' ') || 'Member'}
            </div>
          </div>
        </div>

        <Link to="/profile" className="mobile-menu-item" onClick={handleItemClick}>
          <i className="bi bi-person"></i>
          {menuItems.profile || 'Profile'}
        </Link>
        <Link to="/settings" className="mobile-menu-item" onClick={handleItemClick}>
          <i className="bi bi-gear"></i>
          {menuItems.settings || 'Settings'}
        </Link>
        <Link to="/help" className="mobile-menu-item" onClick={handleItemClick}>
          <i className="bi bi-question-circle"></i>
          {menuItems.helpSupport || 'Help & Support'}
        </Link>

        <button className="mobile-menu-item logout-item" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          {translations.navbar?.logout || 'Logout'}
        </button>
      </div>
    );
  }

  // ─── Desktop Layout ───
  return (
    <div className="user-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="user-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        id="user-dropdown-trigger"
      >
        <AvatarCircle />
        <span className="user-trigger-name">{displayName || 'User'}</span>
        <i className={`bi bi-chevron-down user-trigger-chevron ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          <div className="user-dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="user-dropdown-menu" role="menu" aria-labelledby="user-dropdown-trigger">
            {/* Header */}
            <div className="user-dropdown-header">
              <AvatarCircle size="large" />
              <div className="user-dropdown-header-info">
                <div className="user-dropdown-header-name">{displayName || 'User'}</div>
                <div className="user-dropdown-header-role">
                  {user?.roles?.[0]?.replace('sys:', '').replace('_', ' ') || 'Member'}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <Link to="/profile" className="user-dropdown-item" role="menuitem" onClick={handleItemClick}>
              <i className="bi bi-person"></i>
              {menuItems.profile || 'Profile'}
            </Link>
            <Link to="/settings" className="user-dropdown-item" role="menuitem" onClick={handleItemClick}>
              <i className="bi bi-gear"></i>
              {menuItems.settings || 'Settings'}
            </Link>
            <Link to="/help" className="user-dropdown-item" role="menuitem" onClick={handleItemClick}>
              <i className="bi bi-question-circle"></i>
              {menuItems.helpSupport || 'Help & Support'}
            </Link>

            <div className="user-dropdown-divider" />

            <button className="user-dropdown-item logout-item" role="menuitem" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              {translations.navbar?.logout || 'Logout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdownMenu;
