import React from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useGallery } from '../hooks/useGallery.js';

const Gallery = () => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';
    
    const { images, loading, error } = useGallery();

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">{translations.gallery.loading}</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5 text-center">
                <div className="text-center text-muted py-5">
                    <h4>No photos available at the moment.</h4>
                </div>
            </Container>
        );
    }

    const displayImages = images.length < 6 ? [...images, ...images, ...images, ...images] : [...images, ...images];

    return (
        <section className="py-5 overflow-hidden">
            <Container fluid>
                {images.length > 0 ? (
                    <>
                        <style>
                            {`
                                @keyframes scroll {
                                    0% { transform: translateX(0); }
                                    100% { transform: translateX(${isRtl ? '50%' : '-50%'}); }
                                }
                                .marquee-track {
                                    display: flex;
                                    width: fit-content;
                                    animation: scroll 40s linear infinite;
                                    gap: 1.5rem;
                                    padding-inline-end: 1.5rem; /* Ensure gap consistency for seamless loop */
                                }
                                .marquee-track:hover {
                                    animation-play-state: paused;
                                }
                                .gallery-card {
                                    transition: transform 0.3s ease;
                                }
                                .gallery-card:hover {
                                    transform: scale(1.05);
                                    z-index: 2;
                                    box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
                                }
                            `}
                        </style>
                        <div
                            className="d-flex overflow-hidden w-100 py-4"
                        >
                            <div className="marquee-track">
                                {displayImages.map((img, index) => (
                                <div
                                    key={`${img.id || index}-${index}`}
                                    className="gallery-card position-relative shadow rounded-4 overflow-hidden flex-shrink-0"
                                    style={{
                                        width: '350px',
                                        height: '450px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <img
                                        src={img.imageLink}
                                        alt={img.title || `Gallery image ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {img.title && (
                                        <div
                                            className="position-absolute bottom-0 start-0 w-100 p-3"
                                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                                        >
                                            <h5 className="text-white mb-0 fw-bold">{img.title}</h5>
                                        </div>
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted py-5">
                        <h4>{translations.gallery.noPhotos}</h4>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default Gallery;
