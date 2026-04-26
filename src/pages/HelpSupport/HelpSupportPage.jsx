import React from 'react';
import { Container, Card, Accordion } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';

const HelpSupportPage = () => {
  const { language } = useLanguage();

  const t = (en, ar) => language === 'ar' ? ar : en;

  const faqs = [
    {
      q: t('How do I change my profile picture?', 'كيف أغير صورة ملفي الشخصي؟'),
      a: t(
        'Go to your Profile page by clicking your avatar in the navigation bar, then click on the profile picture to upload a new one.',
        'اذهب إلى صفحة الملف الشخصي عن طريق النقر على الصورة الرمزية في شريط التنقل، ثم انقر على صورة الملف الشخصي لرفع صورة جديدة.'
      ),
    },
    {
      q: t('How do I change my password?', 'كيف أغير كلمة المرور؟'),
      a: t(
        'Navigate to Settings from the dropdown menu, then scroll to the "Change Password" section.',
        'انتقل إلى الإعدادات من القائمة المنسدلة، ثم مرر لأسفل إلى قسم "تغيير كلمة المرور".'
      ),
    },
    {
      q: t('Can I change my name or email?', 'هل يمكنني تغيير اسمي أو بريدي الإلكتروني؟'),
      a: t(
        'You can update your full name anytime from the Settings page. However, your email address is permanent and cannot be changed after registration.',
        'يمكنك تحديث اسمك الكامل في أي وقت من صفحة الإعدادات. أما بريدك الإلكتروني فهو دائم ولا يمكن تغييره بعد التسجيل.'
      ),
    },
    {
      q: t('How do I delete my account?', 'كيف أحذف حسابي؟'),
      a: t(
        'Go to Settings and scroll to the "Danger Zone" section. Click "Delete My Account" and follow the confirmation steps.',
        'اذهب إلى الإعدادات ومرر لأسفل إلى قسم "منطقة الخطر". انقر على "حذف حسابي" واتبع خطوات التأكيد.'
      ),
    },
    {
      q: t('Who do I contact for technical support?', 'بمن أتواصل للدعم الفني؟'),
      a: t(
        'Use the Feedback button at the bottom of the page, or email us at support@steeringassociation.org',
        'استخدم زر الملاحظات في أسفل الصفحة، أو راسلنا على support@steeringassociation.org'
      ),
    },
  ];

  return (
    <>
      <style>{`
        .help-page { max-width: 700px; margin: 0 auto; padding: 2rem 1rem; }
        .help-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          margin-bottom: 1.5rem;
        }
        .help-section-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: #1a1a1a;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .help-accordion .accordion-item {
          border: none;
          border-bottom: 1px solid #f0f0f0;
        }
        .help-accordion .accordion-item:last-child { border-bottom: none; }
        .help-accordion .accordion-button {
          font-weight: 600;
          font-size: 0.92rem;
          color: #333;
          padding: 16px 0;
          background: none;
          box-shadow: none;
        }
        .help-accordion .accordion-button:not(.collapsed) {
          color: #22B2E6;
          background: none;
        }
        .help-accordion .accordion-button::after {
          filter: none;
        }
        .help-accordion .accordion-body {
          padding: 0 0 16px 0;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .help-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .help-contact-item:last-child { border-bottom: none; }
        .help-contact-item i {
          font-size: 1.2rem;
          color: #22B2E6;
          width: 28px;
          text-align: center;
        }
        .help-contact-item span {
          font-weight: 500;
          color: #444;
          font-size: 0.92rem;
        }
      `}</style>

      <Container className="help-page">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#22B2E6' }}>
          {t('Help & Support', 'المساعدة والدعم')}
        </h2>

        {/* FAQ */}
        <Card className="help-card">
          <Card.Body className="p-4">
            <div className="help-section-title">
              <i className="bi bi-question-circle-fill" style={{ color: '#22B2E6' }}></i>
              {t('Frequently Asked Questions', 'الأسئلة الشائعة')}
            </div>

            <Accordion className="help-accordion" flush>
              {faqs.map((faq, idx) => (
                <Accordion.Item eventKey={String(idx)} key={idx}>
                  <Accordion.Header>{faq.q}</Accordion.Header>
                  <Accordion.Body>{faq.a}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>

        {/* Contact */}
        <Card className="help-card">
          <Card.Body className="p-4">
            <div className="help-section-title">
              <i className="bi bi-headset" style={{ color: '#22B2E6' }}></i>
              {t('Contact Us', 'تواصل معنا')}
            </div>

            <div className="help-contact-item">
              <i className="bi bi-envelope"></i>
              <span>support@steeringassociation.org</span>
            </div>
            <div className="help-contact-item">
              <i className="bi bi-chat-dots"></i>
              <span>{t('Use the Feedback button on any page', 'استخدم زر الملاحظات في أي صفحة')}</span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default HelpSupportPage;
