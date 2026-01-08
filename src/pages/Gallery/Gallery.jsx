import React, { useState, useEffect } from 'react';
import { Container, Carousel, Alert, Spinner } from 'react-bootstrap';
import { fetchGallery } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';

const Gallery = () => {
    const { translations } = useLanguage();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGallery = async () => {
            try {
                const data = await fetchGallery();
                setImages(data);
            } catch (err) {
                setError('Failed to load gallery images.');
            } finally {
                setLoading(false);
            }
        };
        loadGallery();
    }, []);

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
        // Graceful fallback or error message, though usually for public pages we might just show "No photos" if failed
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="text-center fw-bold mb-5 text-primary">{translations.gallery.title}</h2>

            {images.length > 0 ? (
                <Carousel className="shadow-lg rounded overflow-hidden">
                    {images.map((img, index) => (
                        <Carousel.Item key={img.id || index} style={{ maxHeight: '600px' }}>
                            <img
                                className="d-block w-100"
                                src={img.url || img.imageUrl} // Adjust based on API response structure
                                alt={img.caption || `Slide ${index + 1}`}
                                style={{ objectFit: 'cover', height: '600px', width: '100%' }}
                            />
                            {img.caption && (
                                <Carousel.Caption>
                                    <h3>{img.title}</h3>
                                    <p>{img.caption}</p>
                                </Carousel.Caption>
                            )}
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <div className="text-center text-muted py-5">
                    <h4>{translations.gallery.noPhotos}</h4>
                </div>
            )}
        </Container>
    );
};

export default Gallery;
