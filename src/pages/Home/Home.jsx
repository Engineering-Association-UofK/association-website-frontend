import React from 'react';
import './Home.css';

// Components
import HeroSection from "../../components/home/HeroSection.jsx";
import AboutSection from "../../components/home/AboutSection.jsx";
import InitiativesSection from "../../components/home/InitiativesSection.jsx";
import NewsFeed from "../../components/home/NewsFeed.jsx";
import {Spinner} from "react-bootstrap";
import SecretariatShowcase from '../../components/secretariat/SecretariatShowcase.jsx';
import Statistics from '../../components/home/Statistics.jsx';

const Home = () => {

    return (
        <div className="home-page">
            <HeroSection />
            <AboutSection />
            <Statistics />
            <InitiativesSection />
            <SecretariatShowcase />
            <NewsFeed />
        </div>
    );
};

export default Home;
