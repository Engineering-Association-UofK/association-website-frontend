import React from 'react';
import './Home.css';

// Components
import HeroSection from "../../components/home/HeroSection.jsx";
import AboutSection from "../../components/home/AboutSection.jsx";
import InitiativesSection from "../../components/home/InitiativesSection.jsx";
import NewsFeed from "../../components/home/NewsFeed.jsx";
import Gallery from "../../components/Gallery.jsx";
import ContactSection from "../../components/home/ContactSection.jsx";
import {Spinner} from "react-bootstrap";
import SecretariatShowcase from '../../components/secretariat/SecretariatShowcase.jsx';

const Home = () => {

    return (
        <div className="home-page">
            <HeroSection 
                title={"Engineering Association"} 
                subtitle={"Loading hero section..."}
            />
            <AboutSection title={"About error"} description={"Loading about section..."}/>
            <Gallery />
            <InitiativesSection />
            <SecretariatShowcase />
            <NewsFeed />
            <ContactSection />
        </div>
    );
};

export default Home;
