import React from 'react';
import './Home.css';

// Components
import HeroSection from "../../components/home/HeroSection.jsx";
import AboutSection from "../../components/home/AboutSection.jsx";
import InitiativesSection from "../../components/home/InitiativesSection.jsx";
import NewsFeed from "../../components/home/NewsFeed.jsx";
import FAQsList from "../../components/FAQsList.jsx";
import Gallery from "../../components/Gallery.jsx";

const Home = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <AboutSection />
            <Gallery />
            <InitiativesSection />
            <NewsFeed />
            <FAQsList />
        </div>
    );
};

export default Home;
