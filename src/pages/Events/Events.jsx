import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Badge } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useEvents } from '../../features/events/hooks/useEvent'; 
import EventDetailsOverlay from './EventDetailsOverlay'; // <-- Import the new component
import "./Events.css";

// --- Skeleton Loader for Event Cards ---
const SkeletonCard = () => (
    <Col md={6} lg={4}>
        <Card className="h-100 shadow-sm border-0 event-card">
            <div style={{ height: '180px', backgroundColor: '#e9ecef' }} className="skeleton-animation rounded-top"></div>
            <Card.Body className="p-4">
                <div style={{ height: '1.5rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '1rem' }} className="skeleton-animation"></div>
                <div style={{ height: '1rem', width: '50%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
                <div style={{ height: '1rem', width: '60%', backgroundColor: '#e9ecef', marginBottom: '1.5rem' }} className="skeleton-animation"></div>
                <div style={{ height: '2.5rem', width: '100%', backgroundColor: '#e9ecef', borderRadius: '50px' }} className="skeleton-animation mt-auto"></div>
            </Card.Body>
        </Card>
    </Col>
);

const Events = () => {
    const { language } = useLanguage();
    const [page, setPage] = useState(1);
    const [allEvents, setAllEvents] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState(null);

    const { data, isLoading, error, isFetching } = useEvents(page, 9);

    useEffect(() => {
        if (data?.events) {
            if (page === 1) setAllEvents(data.events);
            else setAllEvents(prev => [...prev, ...data.events]);
            setHasMore(page < data.pages);
        }
    }, [data, page]);

    const loadMore = () => {
        if (hasMore && !isFetching) setPage(prev => prev + 1);
    };

    if ((isLoading || error) && page === 1 && allEvents.length === 0) {
        return (
            <Container className="py-5 text-center mt-5">
                <Row className="g-4 mt-4">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
                </Row>
                <div className="py-5"><Spinner animation="border" variant="primary" /></div>
            </Container>
        );
    }

    return (
        <Container className="py-5 events-container">
            {/* Header */}
            <div className="text-center mb-5 pb-3">
                <h1 className="page-header-title">
                    {language === 'en' ? "Discover Events" : "اكتشف الفعاليات"}
                </h1>
                <p className="text-muted lead">
                    {language === 'en' ? "Join our latest workshops, seminars, and programs." : "انضم إلى أحدث ورش العمل والندوات والبرامج."}
                </p>
            </div>

            {/* Event Grid */}
            <Row className="g-4">
                {allEvents.map((event) => (
                    <Col md={6} lg={4} key={event.id}>
                        <Card className="h-100 shadow-sm border-0 event-card d-flex flex-column">
                            {/* Card Graphic/Header */}
                            <div className="event-card-graphic d-flex flex-column justify-content-between p-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 fw-bold shadow-sm text-uppercase" style={{ fontSize: '0.75rem' }}>
                                        {event.event_type}
                                    </Badge>
                                    <Badge bg={event.status === 'UPCOMING' ? 'success' : 'secondary'} className="rounded-pill px-3 py-2">
                                        {event.status}
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <Card.Body className="d-flex flex-column p-4">
                                <Card.Title className="fw-bold text-primary mb-3 lh-base" style={{ fontSize: '1.25rem' }}>
                                    {event.name}
                                </Card.Title>
                                
                                <div className="text-muted small mb-2 d-flex align-items-center">
                                    <i className="bi bi-calendar3 me-2 text-primary"></i> 
                                    {new Date(event.start_date).toLocaleDateString()}
                                </div>
                                <div className="text-muted small mb-4 d-flex align-items-center">
                                    <i className="bi bi-people-fill me-2 text-primary"></i> 
                                    {event.participants_count} / {event.max_participants > 0 ? event.max_participants : '∞'} Participants
                                </div>
                                
                                <Button 
                                    variant="outline-primary" 
                                    className="rounded-pill mt-auto fw-bold w-100 action-btn"
                                    onClick={() => setSelectedEventId(event.id)}
                                >
                                    {language === 'en' ? "View Details" : "عرض التفاصيل"}
                                    <i className={`bi bi-arrow-${language === 'en' ? 'right' : 'left'} ms-2`}></i>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

                {/* Loading Skeletons for pagination */}
                {isFetching && page > 1 && (
                    <>{[...Array(3)].map((_, i) => <SkeletonCard key={`fetch-skeleton-${i}`} />)}</>
                )}
            </Row>

            {/* Load More Area */}
            {hasMore && (
                <div className="text-center mt-5 pt-4">
                    <Button 
                        variant="primary" 
                        onClick={loadMore} 
                        disabled={isFetching} 
                        className="btn-action rounded-pill px-5 py-3 fw-bold"
                    >
                        {isFetching ? (
                            <><Spinner as="span" animation="border" size="sm" className="me-2" /> Loading...</>
                        ) : (
                            <>{language === 'en' ? "Load More Events" : "تحميل المزيد من الفعاليات"} <i className="bi bi-chevron-down ms-2"></i></>
                        )}
                    </Button>
                </div>
            )}

            {/* Render Overlay */}
            <EventDetailsOverlay 
                eventId={selectedEventId} 
                show={!!selectedEventId} 
                onHide={() => setSelectedEventId(null)} 
            />
        </Container>
    );
};

export default Events;