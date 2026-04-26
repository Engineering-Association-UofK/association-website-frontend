import React from 'react';
import { Card } from 'react-bootstrap';
import { useLanguage } from '../../../context/LanguageContext';
import ar from './ar.json';
import en from './en.json';
import './About.css';

const OraganizationStructureAbout = () => {
  const { language } = useLanguage();
  const content = language === 'en' ? en : ar;

  // functions to add section (the are all simiral XD)
  const renderSection = (title, description, items) => {
    return (
      <section className="structure-section mb-5">
        <h2 className="text-center fw-bold mb-3 text-primary">{title}</h2>
        <p className="text-center text-muted mb-4 card-desdcription">
          {description}
        </p>
        <div className='cards-container'>
          {items.map((item, idx) => (
            <div className="text-center card">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className={`${item.icon} fs-1 text-primary`}></i>
                </div>
                <Card.Title className="fw-bold text-primary">{item.name}</Card.Title>
                <Card.Text className="text-muted">{item.description}</Card.Text>
              </Card.Body>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCard = (card) => {
    return (
      <div className="text-center card big">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold text-primary title">{card.title}</Card.Title>
          <Card.Text className="text-muted">{card.description}</Card.Text>
        </Card.Body>
      </div>
    );
  };

  return (
    <div className="structure-page">
      {/*moved the style here becuase it dependce on the lang :(*/}
      <style>
        {`
        .card.big .title::after {
          content: ' ';
          width: 120px;
          height: 4px;
          display: block;
          position: relative;
          background-color: rgba(var(--bs-primary-rgb), var(--bs-text-opacity));
          ${language === 'en' ? 'left' : 'right'}: 50%;
          top: 4px;
          border-radius: 20px;
          transform: translateX(${language === 'en' ? '-50%' : '50%'});
        }
        `}
      </style>

      {renderCard(content.thirtyCouncil)}

      {renderCard(content.executiveCommittee)}

      <h1 className="text-center fw-bold mb-5 text-primary" style={{ marginTop: "80px" }}>
        {language === 'en' ? 'Organizational Structure' : 'الهيكل التنظيمي'}
      </h1>

      {/* These are the sections*/}
      {renderSection(content.mediaSecretariat.title, content.mediaSecretariat.description, content.mediaSecretariat.offices)}
      {renderSection(content.academicSecretariat.title, content.academicSecretariat.description, content.academicSecretariat.offices)}
      {renderSection(content.sportsSecretariat.title, content.sportsSecretariat.description, content.sportsSecretariat.offices)}
      {renderSection(content.externalRelationsSecretariat.title, content.externalRelationsSecretariat.description, content.externalRelationsSecretariat.offices)}
      {renderSection(content.culturalSecretariat.title, content.culturalSecretariat.description, content.culturalSecretariat.clubs)}
      {renderSection(content.financialSecretariat.title, content.financialSecretariat.description, content.financialSecretariat.offices)}
      {renderSection(content.generalSecretariat.title, content.generalSecretariat.description, content.generalSecretariat.offices)}
      {renderSection(content.socialSecretariat.title, content.socialSecretariat.description, content.socialSecretariat.offices)}

      {renderCard(content.joinSection)}

    </div>
  );
};

export default OraganizationStructureAbout;