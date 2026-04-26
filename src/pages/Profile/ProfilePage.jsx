import React, { useState, useRef } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { userService } from '../../features/auth/api/user.service';
import { CONFIG } from '../../config';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { language } = useLanguage();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const displayName = language === 'ar'
    ? (user?.name_ar || user?.name_en || '')
    : (user?.name_en || user?.name_ar || '');

  const getInitials = () => {
    const name = user?.name_en || user?.name_ar || '';
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0]?.toUpperCase() || '?';
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'danger', text: language === 'ar' ? 'يرجى اختيار ملف صورة' : 'Please select an image file' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: language === 'ar' ? 'حجم الملف كبير جداً (الحد 5MB)' : 'File is too large (max 5MB)' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const result = await userService.updateUserAvatar(user.user_id, formData);
      updateUserProfile({ avatar_url: result?.avatar_url || URL.createObjectURL(file) });
      setMessage({ type: 'success', text: language === 'ar' ? 'تم تحديث الصورة بنجاح' : 'Avatar updated successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: language === 'ar' ? 'فشل تحديث الصورة' : 'Failed to update avatar' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <style>{`
        .profile-page { max-width: 700px; margin: 0 auto; padding: 2rem 1rem; }
        .profile-avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          cursor: pointer;
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 2.5rem;
          color: #fff;
          background: linear-gradient(135deg, #22B2E6, #1a8fc0);
          overflow: hidden;
          border: 4px solid #fff;
          box-shadow: 0 4px 20px rgba(34, 178, 230, 0.3);
          text-transform: uppercase;
          transition: transform 0.2s ease;
        }
        .profile-avatar:hover { transform: scale(1.05); }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .profile-avatar-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(transparent, rgba(0,0,0,0.5));
          border-radius: 0 0 50% 50%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .profile-avatar-wrapper:hover .profile-avatar-overlay { opacity: 1; }
        .profile-avatar-overlay i { color: #fff; font-size: 1.2rem; }
        .profile-info-card { border: none; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); }
        .profile-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .profile-info-row:last-child { border-bottom: none; }
        .profile-info-label { font-weight: 600; color: #666; font-size: 0.9rem; }
        .profile-info-value { font-weight: 500; color: #1a1a1a; font-size: 0.95rem; }
      `}</style>

      <Container className="profile-page">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#22B2E6' }}>
          {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
        </h2>

        {message.text && (
          <Alert variant={message.type} className="text-center" dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {/* Avatar */}
        <div className="profile-avatar-wrapper" onClick={handleAvatarClick}>
          <div className="profile-avatar">
            {uploading ? (
              <Spinner animation="border" variant="light" />
            ) : user?.avatar_url ? (
              <img src={user.avatar_url} alt={displayName} />
            ) : (
              getInitials()
            )}
          </div>
          <div className="profile-avatar-overlay">
            <i className="bi bi-camera"></i>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-center text-muted small mb-4">
          {language === 'ar' ? 'انقر لتغيير الصورة' : 'Click to change avatar'}
        </p>

        {/* Profile Info */}
        <Card className="profile-info-card">
          <Card.Body className="p-4">
            <div className="profile-info-row">
              <span className="profile-info-label">
                {language === 'ar' ? 'الاسم (English)' : 'Name (English)'}
              </span>
              <span className="profile-info-value">{user?.name_en || '—'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">
                {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
              </span>
              <span className="profile-info-value" dir="rtl">{user?.name_ar || '—'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">
                {language === 'ar' ? 'الدور' : 'Role'}
              </span>
              <span className="profile-info-value" style={{ textTransform: 'capitalize' }}>
                {user?.roles?.[0]?.replace('sys:', '').replace(/_/g, ' ') || 'Member'}
              </span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ProfilePage;
