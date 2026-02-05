import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { usePublicSecretariats } from '../../features/secretariats/hooks/useSecretariats';
import './Secretariats.css';

const Secretariats = () => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';

    // Fetch secretariats from API
    const { data: secretariats, isLoading, isError } = usePublicSecretariats();

    const introTitle = isArabic
        ? 'مقدمة عن سلسلة مكاتب الأمانات'
        : 'Introduction to the Secretariat Offices Series';

    const pageTitle = isArabic
        ? 'أمانات الاتحاد'
        : "Association's Secretariats";

    // Helper function to get translated field
    const getTranslatedField = (secretariat, field) => {
        if (isArabic && secretariat.translations) {
            const arTranslation = secretariat.translations.find(t => t.lang === 'ar');
            if (arTranslation && arTranslation[field]) {
                return arTranslation[field];
            }
        }
        return secretariat[field];
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5 py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {isArabic
                        ? 'حدث خطأ في تحميل بيانات الأمانات'
                        : 'Error loading secretariats'}
                </Alert>
            </Container>
        );
    }

    return (
        <div className="secretariats-page" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <div className="secretariats-hero">
                <Container>
                    <h1>{pageTitle}</h1>
                    <p className="lead">
                        {isArabic
                            ? 'تعرف على الأمانات الثمانية التي تشكل العمود الفقري لاتحاد الهندسة التسييري، كل منها مكرسة لخدمة مجتمع الهندسة بطرق فريدة ومتميزة.'
                            : 'Discover the eight secretariats that form the backbone of the Steering Engineering Association, each dedicated to serving the engineering community in unique and distinguished ways.'}
                    </p>
                </Container>
            </div>

            <Container className="pb-5">
                {/* Introduction Section */}
                <div className="secretariats-intro">
                    <h2>{introTitle}</h2>
                    <p>
                        {isArabic
                            ? 'يتكون اتحاد الهندسة التسييري من ثمان أمانات، تعمل كل منها بتناغم لتحقيق رؤية الاتحاد في خدمة الطلاب وتطوير البيئة الجامعية. تتضمن كل أمانة مجموعة من المكاتب المتخصصة التي تغطي جوانب مختلفة من الحياة الطلابية والأكاديمية والاجتماعية.'
                            : 'The Steering Engineering Association consists of eight secretariats, each working in harmony to achieve the Association\'s vision of serving students and developing the university environment. Each secretariat includes a set of specialized offices covering different aspects of student, academic, and social life.'}
                    </p>
                </div>

                {/* Secretariats List */}
                <Row>
                    {secretariats && secretariats.map((secretariat, index) => {
                        const title = getTranslatedField(secretariat, 'name');
                        const description = getTranslatedField(secretariat, 'description');
                        const secretariatId = secretariat.id || secretariat.secretariatId;

                        return (
                            <Col xs={12} key={secretariatId || index}>
                                <Link
                                    to={`/secretariats/${secretariatId}`}
                                    className="secretariat-card-link"
                                >
                                    <div className="secretariat-card">
                                        <h2>
                                            <span className="secretariat-number">{index + 1}</span>
                                            {title}
                                        </h2>

                                        <p className="secretariat-description">
                                            {description}
                                        </p>

                                        <span className="view-details-btn">
                                            {isArabic ? 'عرض التفاصيل ←' : 'View Details →'}
                                        </span>
                                    </div>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </div>
    );
};

export default Secretariats;

