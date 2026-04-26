import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { userService } from '../../features/auth/api/user.service';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // ─── Account Info State ───
  const [fullName, setFullName] = useState(user?.name_en || '');
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState({ type: '', text: '' });

  // ─── Password State ───
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // ─── Delete Account State ───
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState({ type: '', text: '' });

  const t = (en, ar) => language === 'ar' ? ar : en;

  // ─── Handlers ───
  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setNameMsg({ type: 'danger', text: t('Please enter your full name', 'يرجى إدخال اسمك الكامل') });
      return;
    }
    setSavingName(true);
    setNameMsg({ type: '', text: '' });
    try {
      await userService.updateUserName(user.user_id, { name_en: fullName, name_ar: fullName });
      updateUserProfile({ name_en: fullName, name_ar: fullName });
      setNameMsg({ type: 'success', text: t('Name updated successfully!', 'تم تحديث الاسم بنجاح!') });
    } catch (err) {
      setNameMsg({ type: 'danger', text: err.response?.data?.message || t('Failed to update name', 'فشل تحديث الاسم') });
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'danger', text: t('Passwords do not match', 'كلمات المرور غير متطابقة') });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'danger', text: t('Password must be at least 6 characters', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل') });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      await userService.changePassword({ oldPassword, newPassword, confirmPassword });
      setPasswordMsg({ type: 'success', text: t('Password changed successfully!', 'تم تغيير كلمة المرور بنجاح!') });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'danger', text: err.response?.data?.message || t('Failed to change password', 'فشل تغيير كلمة المرور') });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteMsg({ type: '', text: '' });
    try {
      await userService.deleteAccount(user.user_id);
      logout();
      navigate('/');
    } catch (err) {
      setDeleteMsg({ type: 'danger', text: err.response?.data?.message || t('Failed to delete account', 'فشل حذف الحساب') });
      setDeleting(false);
    }
  };

  const sectionCardStyle = {
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem',
  };

  const sectionTitleStyle = {
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#1a1a1a',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <>
      <style>{`
        .settings-page { max-width: 700px; margin: 0 auto; padding: 2rem 1rem; }
        .settings-input {
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 10px 14px;
          transition: all 0.2s ease;
        }
        .settings-input:focus {
          border-color: #22B2E6;
          box-shadow: 0 0 0 3px rgba(34, 178, 230, 0.12);
        }
        .settings-input[readonly] {
          background-color: #f8f9fa;
          color: #999;
          cursor: not-allowed;
        }
        .settings-save-btn {
          background-color: #22B2E6;
          border: none;
          border-radius: 10px;
          padding: 10px 28px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .settings-save-btn:hover {
          background-color: #1a9ac7;
          transform: translateY(-1px);
        }
        .danger-zone {
          border: 2px solid #fed7d7 !important;
          background: #fffbfb;
        }
        .delete-btn {
          background-color: #e53e3e;
          border: none;
          border-radius: 10px;
          padding: 10px 28px;
          font-weight: 600;
          color: white;
          transition: all 0.2s ease;
        }
        .delete-btn:hover {
          background-color: #c53030;
          transform: translateY(-1px);
          color: white;
        }
      `}</style>

      <Container className="settings-page">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#22B2E6' }}>
          {t('Settings', 'الإعدادات')}
        </h2>

        {/* ─── Account Info ─── */}
        <Card style={sectionCardStyle}>
          <Card.Body className="p-4">
            <div style={sectionTitleStyle}>
              <i className="bi bi-person-circle" style={{ color: '#22B2E6' }}></i>
              {t('Account Information', 'معلومات الحساب')}
            </div>

            {nameMsg.text && (
              <Alert variant={nameMsg.type} className="py-2 small" dismissible onClose={() => setNameMsg({ type: '', text: '' })}>
                {nameMsg.text}
              </Alert>
            )}

            <Form onSubmit={handleSaveName}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <Form.Label className="small fw-semibold text-secondary">
                    {t('Full name', 'الاسم الكامل')} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="settings-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('Your full name', 'اسمك الكامل')}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label className="small fw-semibold text-secondary">
                    {t('Email address', 'البريد الإلكتروني')} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    className="settings-input"
                    value={user?.email || ''}
                    readOnly
                    title={t('Email cannot be changed', 'لا يمكن تغيير البريد الإلكتروني')}
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="settings-save-btn text-white" disabled={savingName}>
                  {savingName ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                  {t('Save', 'حفظ')}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* ─── Change Password ─── */}
        <Card style={sectionCardStyle}>
          <Card.Body className="p-4">
            <div style={sectionTitleStyle}>
              <i className="bi bi-shield-lock" style={{ color: '#22B2E6' }}></i>
              {t('Change Password', 'تغيير كلمة المرور')}
            </div>

            {passwordMsg.text && (
              <Alert variant={passwordMsg.type} className="py-2 small" dismissible onClose={() => setPasswordMsg({ type: '', text: '' })}>
                {passwordMsg.text}
              </Alert>
            )}

            <Form onSubmit={handleChangePassword}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">
                  {t('Current Password', 'كلمة المرور الحالية')}
                </Form.Label>
                <Form.Control
                  type="password"
                  className="settings-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">
                  {t('New Password', 'كلمة المرور الجديدة')}
                </Form.Label>
                <Form.Control
                  type="password"
                  className="settings-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">
                  {t('Confirm New Password', 'تأكيد كلمة المرور الجديدة')}
                </Form.Label>
                <Form.Control
                  type="password"
                  className="settings-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="text-end">
                <Button type="submit" className="settings-save-btn text-white" disabled={savingPassword}>
                  {savingPassword ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                  {t('Change Password', 'تغيير كلمة المرور')}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* ─── Delete Account ─── */}
        <Card style={{ ...sectionCardStyle }} className="danger-zone">
          <Card.Body className="p-4">
            <div style={{ ...sectionTitleStyle, color: '#e53e3e' }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ color: '#e53e3e' }}></i>
              {t('Danger Zone', 'منطقة الخطر')}
            </div>

            {deleteMsg.text && (
              <Alert variant={deleteMsg.type} className="py-2 small">
                {deleteMsg.text}
              </Alert>
            )}

            <p className="text-muted small mb-3">
              {t(
                'Deleting your account is permanent and cannot be undone. All your data will be lost.',
                'حذف حسابك نهائي ولا يمكن التراجع عنه. ستفقد جميع بياناتك.'
              )}
            </p>

            <Button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
              {t('Delete My Account', 'حذف حسابي')}
            </Button>
          </Card.Body>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold" style={{ color: '#e53e3e' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {t('Confirm Account Deletion', 'تأكيد حذف الحساب')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-3">
              {t(
                'This action is irreversible. To confirm, type "DELETE" below:',
                'هذا الإجراء لا يمكن التراجع عنه. للتأكيد، اكتب "DELETE" أدناه:'
              )}
            </p>
            <Form.Control
              type="text"
              className="settings-input"
              placeholder='DELETE'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} style={{ borderRadius: '10px' }}>
              {t('Cancel', 'إلغاء')}
            </Button>
            <Button
              className="delete-btn"
              disabled={deleteConfirmText !== 'DELETE' || deleting}
              onClick={handleDeleteAccount}
            >
              {deleting ? <Spinner size="sm" animation="border" className="me-2" /> : null}
              {t('Yes, Delete', 'نعم، احذف')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default SettingsPage;
