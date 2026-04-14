import React, { useState, useEffect, useRef } from 'react';
import { useBot } from '../../hooks/useBot.js';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './FloatingBot.css';

const FloatingBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const { language, translations } = useLanguage();
    const { isAuthenticated } = useAuth();

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        
        if (!isAuthenticated) {
            
            const timer = setTimeout(() => {
                setShowHelp(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    const { messages, options, loading, isFinal, sendMessage, resetBot } = useBot(language);
    const messagesEndRef = useRef(null);

    const toggleBot = () => {
        if (showHelp) setShowHelp(false); 
        const newState = !isOpen;
        if (!newState) setIsClosing(true); 
        
        setIsOpen(newState);
        
        if (newState && messages.length === 0) {
            sendMessage('@root');
        }
    };

    const handleAnimationEnd = () => {
        if (isClosing) {
            setIsOpen(false);
            setIsClosing(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const origin = dir === 'rtl' ? 'bottom left' : 'bottom right';

    return (
        <div className={`position-fixed bottom-0 ${dir === 'rtl' ? 'start-0' : 'end-0'} p-3`} style={{ zIndex: 1050, direction: dir }}>
            
            {(isOpen || isClosing) && (
                <div
                    className={`chat-window shadow-lg mb-3 ${isClosing ? 'bot-window-exit' : 'bot-window-enter'}`}
                    style={{ 
                        width: '380px', 
                        height: '480px',
                        maxHeight: '80vh',
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: '15px', 
                        border: 'none',
                        transformOrigin: origin 
                    }}
                    onAnimationEnd={handleAnimationEnd}
                >
                    <div className="chat-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">SEA Assistant</h6>
                        <div>
                            <button className="btn btn-sm btn-link text-white text-decoration-none" onClick={resetBot} title="Restart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                            </button>
                            <button className="btn btn-sm btn-link text-white text-decoration-none" onClick={() => setIsClosing(true)} title="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    
                    <div className="chat-body overflow-auto flex-grow-1 bg-light p-2">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                                <div className={`rounded-3 msg-bubble ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border text-dark'}`} style={{ maxWidth: '85%' }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="d-flex justify-content-start mb-2">
                                <div className="p-2 rounded bg-white border text-secondary fst-italic" style={{ fontSize: '0.85rem' }}>
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer bg-white border-top">
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                            {options.map((opt, idx) => (
                                <button 
                                    key={idx} 
                                    className="btn btn-outline-primary btn-sm rounded-pill bot-options-btn"
                                    onClick={() => sendMessage(opt.keyword, opt.trigger)}
                                    disabled={loading}
                                >
                                    {opt.trigger}
                                </button>
                            ))}
                            {isFinal && (
                                <button className="btn btn-secondary btn-sm w-100" onClick={resetBot}>Start Over</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            
            {!isOpen && (
                <div className="bot-fab-idle">

                    
                    {!isOpen && !isClosing && showHelp && (
                        <div
                            className="bot-help-bubble"
                            onClick={toggleBot}
                        >
                            {translations.bot?.needHelp || "Need help?"}
                        </div>
                    )}
                    <button
                        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center "
                        style={{ width: '60px', height: '60px' }}
                        onClick={toggleBot}
                    >
                        
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingBot;