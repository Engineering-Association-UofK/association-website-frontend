import React, { useState, useEffect } from 'react';
import { Spinner, Button, Modal, Badge, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext'; 
import { useEvent, useApply, useGetStatus, useCancelApplication } from '../../features/events/hooks/useEvent';

const EventDetailsOverlay = ({ eventId, show, onHide }) => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth(); 
    
    // UI Feedback State (Success/Error messages)
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // Clear feedback when modal closes/opens
    useEffect(() => {
        if (!show) setFeedback({ type: '', message: '' });
    }, [show]);
    
    // API Hooks
    const { data: event, isLoading: isEventLoading, error: eventError } = useEvent(eventId);
    // Fetch status. Ensure your useGetStatus hook has `enabled: !!eventId && !!user` if possible, 
    // but React Query will handle it gracefully if you added the enabled flag as suggested.
    const { data: statusData, isLoading: isStatusLoading } = useGetStatus(1, 10, eventId);
    
    const { mutate: applyToEvent, isPending: isApplying } = useApply();
    const { mutate: cancelApplication, isPending: isCanceling } = useCancelApplication();

    // Determine current application status
    const currentApplication = statusData?.applications?.[0];
    const participationStatus = currentApplication?.status; // PENDING, ACCEPTED, REJECTED, COMPLETED, or undefined

    const handleApply = () => {
        setFeedback({ type: '', message: '' });

        if (!user) {
            sessionStorage.setItem('redirectAfterLogin', `/events`);
            navigate('/login');
            return;
        }

        applyToEvent(eventId, {
            onSuccess: (response) => {
                const data = response.data || response; 
                
                if (data.form_required && data.form_id) {
                    navigate(`/form/${data.form_id}`);
                } else {
                    setFeedback({ 
                        type: 'success', 
                        message: language === 'en' ? 'Successfully joined the event!' : 'تم الانضمام للفعالية بنجاح!' 
                    });
                    // Force refresh the status query so the UI updates to "PENDING/ACCEPTED" immediately
                    queryClient.invalidateQueries(['status', 1, eventId]);
                }
            },
            onError: (err) => {
                const errorMsg = err.response?.data?.message || 'Failed to join the event. Please try again.';
                setFeedback({ type: 'danger', message: errorMsg });
            }
        });
    };

    const handleCancel = () => {
        setFeedback({ type: '', message: '' });
        
        cancelApplication(eventId, {
            onSuccess: () => {
                setFeedback({ 
                    type: 'success', 
                    message: language === 'en' ? 'Application cancelled successfully.' : 'تم إلغاء الطلب بنجاح.' 
                });
                queryClient.invalidateQueries(['status', 1, eventId]);
            },
            onError: (err) => {
                const errorMsg = err.response?.data?.message || 'Failed to cancel application. Please try again.';
                setFeedback({ type: 'danger', message: errorMsg });
            }
        });
    };

    // Helper function to render the correct UI in the top right based on user status
    const renderActionArea = () => {
        if (!user) {
            return (
                <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleApply}>
                    <i className="bi bi-box-arrow-in-right me-2"></i> 
                    {language === 'en' ? "Login to Join" : "سجل الدخول للانضمام"}
                </Button>
            );
        }

        if (isStatusLoading) {
            return <Spinner animation="border" size="sm" variant="primary" />;
        }

        // Not applied yet
        if (!participationStatus) {
            return (
                <Button 
                    variant="primary" 
                    className="btn-action rounded-pill px-4 fw-bold"
                    onClick={handleApply}
                    disabled={isApplying}
                >
                    {isApplying ? <Spinner as="span" animation="border" size="sm" /> : (language === 'en' ? "Join Event" : "انضم للفعالية")}
                </Button>
            );
        }

        // Already applied - Handle different states
        switch (participationStatus) {
            case 'PENDING':
                return (
                    <div className="d-flex align-items-center gap-3">
                        <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">
                            <i className="bi bi-hourglass-split me-1"></i> {language === 'en' ? 'Pending' : 'قيد الانتظار'}
                        </Badge>
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="rounded-pill px-3 fw-bold"
                            onClick={handleCancel}
                            disabled={isCanceling}
                        >
                            {isCanceling ? <Spinner as="span" animation="border" size="sm" /> : (language === 'en' ? "Cancel" : "إلغاء الطلب")}
                        </Button>
                    </div>
                );
            case 'REJECTED':
                return (
                    <div className="text-end">
                        <Badge bg="danger" className="px-3 py-2 rounded-pill fw-bold mb-1">
                            <i className="bi bi-x-circle me-1"></i> {language === 'en' ? 'Application Rejected' : 'تم رفض الطلب'}
                        </Badge>
                        <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                            {language === 'en' ? 'You are not eligible to join this event again.' : 'غير مصرح لك بالانضمام لهذه الفعالية مجدداً.'}
                        </div>
                    </div>
                );
            case 'ACCEPTED':
            case 'COMPLETED':
            default:
                return (
                    <Badge bg="success" className="px-4 py-2 rounded-pill fw-bold shadow-sm fs-6">
                        <i className="bi bi-check-circle-fill me-2"></i> 
                        {language === 'en' ? 'You are a Participant' : 'أنت مشارك في الفعالية'}
                    </Badge>
                );
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="event-modal" backdropClassName="event-modal-backdrop">
            {isEventLoading ? (
                <div className="d-flex justify-content-center align-items-center py-5 bg-white rounded-4" style={{ minHeight: '400px' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : eventError || !event ? (
                <div className="p-5 text-center bg-white rounded-4">
                    <h4 className="text-danger mb-4">Failed to load event details.</h4>
                    <Button variant="outline-primary" onClick={onHide} className="rounded-pill">Close</Button>
                </div>
            ) : (
                <div className="event-overlay-content">
                    {/* Modal Hero Header */}
                    <div className="event-modal-hero">
                        <div className="d-flex justify-content-between align-items-start position-relative z-3 w-100">
                            <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill shadow-sm fw-bold">
                                {event.event_type}
                            </Badge>
                            <button className="btn-close btn-close-white" onClick={onHide}></button>
                        </div>
                    </div>

                    {/* Overlapping Paper Content */}
                    <div className="event-modal-paper shadow-lg">
                        
                        {/* HEADER AREA: Title on left, Action on right */}
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                            <h2 className="event-title mb-0" style={{ flex: '1 1 auto', minWidth: '250px' }}>
                                {event.name}
                            </h2>
                            <div className="action-area flex-shrink-0 d-flex align-items-center">
                                {renderActionArea()}
                            </div>
                        </div>

                        {/* Feedback Alert System */}
                        {feedback.message && (
                            <Alert variant={feedback.type} className="rounded-3 border-0 shadow-sm d-flex justify-content-between align-items-center mb-4">
                                <span>
                                    {feedback.type === 'success' ? <i className="bi bi-check-circle-fill me-2"></i> : <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                                    {feedback.message}
                                </span>
                                <button type="button" className="btn-close btn-sm" onClick={() => setFeedback({ type: '', message: '' })}></button>
                            </Alert>
                        )}
                        
                        <div className="d-flex gap-3 mb-4 flex-wrap">
                            <span className="badge-custom">
                                <i className="bi bi-calendar-event me-2"></i>
                                {new Date(event.schedule?.start).toLocaleDateString()} - {new Date(event.schedule?.end).toLocaleDateString()}
                            </span>
                            <span className="badge-custom">
                                <i className="bi bi-people-fill me-2"></i>
                                {event.max_participants > 0 ? `${event.max_participants} Spots` : 'Unlimited'}
                            </span>
                        </div>

                        <p className="event-description mb-5 text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                            {event.description}
                        </p>

                        <Row className="g-4 mb-4">
                            {/* Presenters */}
                            <Col xs={12} lg={4}>
                                <div className="detail-box h-100 p-4 rounded-4 bg-light border">
                                    <h5 className="fw-bold text-primary mb-3">
                                        {language === 'en' ? "Presenters" : "المقدمون"}
                                    </h5>
                                    <ul className="list-unstyled mb-0">
                                        {event.presenter?.map((p) => (
                                            <li key={p.id} className="mb-3 text-secondary d-flex align-items-center">
                                                <div className="bg-white rounded-circle p-2 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="bi bi-person-video3 text-primary fs-5"></i>
                                                </div>
                                                <span className="fw-medium">{p.name}</span>
                                            </li>
                                        )) || <li className="text-muted">TBA</li>}
                                    </ul>
                                </div>
                            </Col>

                            {/* Outcomes */}
                            <Col xs={12} lg={8}>
                                <div className="detail-box h-100 p-4 rounded-4 bg-light border">
                                    <h5 className="fw-bold text-primary mb-3">
                                        {language === 'en' ? "Outcomes" : "النتائج المتوقعة"}
                                    </h5>
                                    <ul className="mb-0 text-secondary ps-3" style={{ lineHeight: '1.8' }}>
                                        {event.outcomes?.map((outcome, idx) => (
                                            <li key={idx} className="mb-2">{outcome}</li>
                                        )) || <li className="text-muted list-unstyled">N/A</li>}
                                    </ul>
                                </div>
                            </Col>
                        </Row>

                        {/* Grading Scheme */}
                        {event.grading_scheme?.length > 0 && (
                            <div className="p-4 rounded-4 bg-slate text-white border mt-4">
                                <h5 className="fw-bold text-white mb-3">
                                    {language === 'en' ? "Grading Scheme" : "نظام التقييم"}
                                </h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {event.grading_scheme.map(grade => (
                                        <Badge bg="primary" className="p-2 px-3 rounded-pill fs-6 fw-normal" key={grade.id}>
                                            {grade.name}: {grade.max_score} pts
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default EventDetailsOverlay;