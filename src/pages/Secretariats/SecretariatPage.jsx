import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { usePublicSecretariat } from '../../features/secretariats/hooks/useSecretariats';
import './Secretariats.css';

const SecretariatPage = () => {
    const { id } = useParams();
    const { language } = useLanguage();
    const isArabic = language === 'ar';

    const { data: secretariat, isLoading, isError } = usePublicSecretariat(id);

    if (isLoading) {
        return (
            <div className="text-center mt-5 py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
        );
    }

    if (isError || !secretariat) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {isArabic
                        ? 'حدث خطأ في تحميل بيانات الأمانة'
                        : 'Error loading secretariat details'}
                </Alert>
                <Link to="/secretariats" className="btn btn-primary">
                    {isArabic ? 'العودة إلى الأمانات' : 'Back to Secretariats'}
                </Link>
            </Container>
        );
    }

    // Get appropriate translation based on language
    const getTranslatedField = (field) => {
        if (isArabic && secretariat.translations) {
            const arTranslation = secretariat.translations.find(t => t.lang === 'ar');
            if (arTranslation && arTranslation[field]) {
                return arTranslation[field];
            }
        }
        return secretariat[field];
    };

    const title = getTranslatedField('name');
    const description = getTranslatedField('description');
    const imageUrl = secretariat.imageUrl || secretariat.image;

    return (
        <div className="secretariat-page" dir={isArabic ? 'rtl' : 'ltr'}>
            <Container className="py-5">
                <Link to="/secretariats" className="btn btn-outline-primary mb-4">
                    {isArabic ? '→ العودة إلى الأمانات' : '← Back to Secretariats'}
                </Link>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="secretariat-page-image mb-4"
                    />
                )}

                <h1>{title}</h1>

                <p className="secretariat-page-description">{description}</p>

                {/* Display offices if available */}
                {secretariat.offices && secretariat.offices.length > 0 && (
                    <div className="offices-section mt-4">
                        <h3 className="offices-title">
                            {isArabic ? 'المكاتب والأندية:' : 'Offices & Clubs:'}
                        </h3>
                        <ul className="offices-list">
                            {secretariat.offices.map((office, index) => {
                                const officeName = isArabic && office.nameAr ? office.nameAr : office.name;
                                const officeDesc = isArabic && office.descriptionAr ? office.descriptionAr : office.description;

                                return (
                                    <li className="office-list-item" key={index}>
                                        <strong>{officeName}</strong>
                                        <p className="office-description">{officeDesc}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SecretariatPage;
