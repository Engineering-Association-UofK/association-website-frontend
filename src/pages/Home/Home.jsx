import React from 'react';
import './Home.css';

// Components
import HeroSection from "../../components/home/HeroSection.jsx";
import AboutSection from "../../components/home/AboutSection.jsx";
import InitiativesSection from "../../components/home/InitiativesSection.jsx";
import NewsFeed from "../../components/home/NewsFeed.jsx";
import Gallery from "../../components/Gallery.jsx";
import ContactSection from "../../components/home/ContactSection.jsx";
import {useGenerics} from "../../features/generics/hooks/useGenerics.js";
import {Spinner} from "react-bootstrap";

const Home = () => {
    const keywords = ['home_hero', 'home_about'];
    const { data: generics, isLoading } = useGenerics(keywords);

    const getText = (key) => generics?.[key] || {};

    if (isLoading) {
        return (
            <section className="py-5 bg-light text-center">
                <Spinner animation="border" variant="primary" />
            </section>
        );
    }

    return (
        <div className="home-page">
            <HeroSection 
                title={getText('home_hero').title || "Engineering Association"} 
                subtitle={getText('home_hero').body || "Loading hero section..."}
                keyword="home_hero"
                data={getText('home_hero')}
            />
            <AboutSection title={getText('home_about').title || "About error"} description={getText('home_about').body || "Loading about section..."}/>
            <Gallery />
            <InitiativesSection />
            <NewsFeed />
            <ContactSection />
        </div>
    );
};

export default Home;
