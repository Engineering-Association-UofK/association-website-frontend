import React, { useState } from 'react';
import api from '../../utils/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './FeedbackWidget.css';

const FeedbackWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const { translations, language } = useLanguage();
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // A function to parse JWT and get create a contact string if not given contact info
    // returns empty string if no token is found
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setStatus(null);

        try {
            const payload = { message };

            if (contact.trim()) {
                payload.senderContact = contact;
            } else {
                let contactInfo = '';

                const token = localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');
                if (token) {
                    const claims = parseJwt(token);
                    if (claims && claims.sub && claims.type) {
                        contactInfo = `No Contact: ${claims.type} - ${claims.sub}`;
                    }
                }
                payload.senderContact = contactInfo;
            }

            await api.post('/feedback', payload);
            setStatus('success');
            setMessage('');
            setContact('');
            setTimeout(() => {
                setIsOpen(false);
                setStatus(null);
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                className={`btn btn-secondary rounded-pill feedback-fab ${dir === 'rtl' ? 'end-0 me-3' : 'start-0 ms-3'}`}
                onClick={() => setIsOpen(true)}
            >
                {translations.feedback?.button || "Feedback"}
            </button>

            {isOpen && (
                <div className="feedback-modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="feedback-modal" onClick={e => e.stopPropagation()} dir={dir}>
                        <div className="modal-header bg-light p-3 d-flex justify-content-between align-items-center border-bottom">
                            <h5 className="m-0">{translations.feedback?.title || "Technical Feedback"}</h5>
                            <button type="button" className="btn-close m-0" onClick={() => setIsOpen(false)}></button>
                        </div>
                        <div className="modal-body p-3">
                            {status === 'success' ? (
                                <div className="alert alert-success text-center mb-0">
                                    {translations.feedback?.success || "Thank you for your feedback!"}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">{translations.feedback?.messageLabel || "Message"}</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4" 
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={translations.feedback?.messagePlaceholder || "Describe the issue..."}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{translations.feedback?.contactLabel || "Contact (Optional)"}</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={contact}
                                            onChange={(e) => setContact(e.target.value)}
                                            placeholder={translations.feedback?.contactPlaceholder || "Email or Phone"}
                                        />
                                    </div>
                                    {status === 'error' && <div className="text-danger mb-2 small">{translations.feedback?.error || "Failed to send."}</div>}
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? (translations.feedback?.sending || "Sending...") : (translations.feedback?.send || "Send Feedback")}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackWidget;