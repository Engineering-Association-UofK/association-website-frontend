import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; 
import { useLanguage } from '../../context/LanguageContext';
import FormCard from './formcard'; 

const CategoryView = () => {
  const { categoryId } = useParams(); 
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [filteredForms, setFilteredForms] = useState([]);

  useEffect(() => {
    const allForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
    const match = allForms.filter(f => f.status === 'published' && f.category === categoryId);
    setFilteredForms(match);
  }, [categoryId]);

  const getFormStatus = (openDate, closeDate) => {
    const now = new Date();
    const start = new Date(openDate);
    const end = new Date(closeDate);
    if (now < start) return language === 'ar' ? 'يفتح قريباً' : 'Opening Soon';
    if (now > end) return language === 'ar' ? 'منتهي' : 'Closed';
    return language === 'ar' ? 'مفتوح الآن' : 'Opened';
  };

  const getRemainingTime = (closeDate) => {
    if (!closeDate) return "";
    const diff = new Date(closeDate) - new Date();
    if (diff <= 0) return "";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return language === 'ar' ? `متبقي ${hours} ساعة` : `${hours}h left`;
  };

  return (
    <Container className="py-5" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <h2 className="mb-4 text-start text-primary fw-bold">Available Forms</h2>
      {filteredForms.length > 0 ? (
        <Row className="g-4">
          {filteredForms.map((form) => {
            const status = getFormStatus(form.openDate, form.closeDate);
            const isOpen = status === (language === 'ar' ? 'مفتوح الآن' : 'Opened');
            return (
              <Col key={form.id} md={6} lg={4}>
                <FormCard 
                  title={form.title}
                  description={language === 'ar' ? 'اضغط للتقديم' : 'Click to apply'}
                  status={status}
                  deadline={getRemainingTime(form.closeDate)}
                  showDeadline={isOpen}
                  btnLabel={language === 'ar' ? "قدم الآن" : "Apply Now"}
                  onClick={() => navigate(`/apply/${form.id}`)}
                />
              </Col>
            );
          })}
        </Row>
      ) : <p className="text-muted">No forms available.</p>}
    </Container>
  );
};

export default CategoryView;