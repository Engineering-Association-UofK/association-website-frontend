import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import enContent from './en.json';
import arContent from './ar.json';
import './About.css';

const TeamStructure = () => {
    const { language } = useLanguage();
    return (
        <Container className="py-5">
            <h1>Team Structure</h1>
            <p>Content coming soon...</p>
        </Container>
    );
};

export default TeamStructure;