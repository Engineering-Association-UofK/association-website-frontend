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
        <div 
            className={`position-fixed bottom-0 ${dir === 'rtl' ? 'start-0' : 'end-0'} p-3 floating-bot-container`} 
            style={{ direction: dir }}
            dir={dir}
        >
            
            {(isOpen || isClosing) && (
                <div
                    className={`chat-window mb-3 shadow-lg ${isClosing ? 'bot-window-exit' : 'bot-window-enter'}`}
                    style={{ transformOrigin: origin }}
                    onAnimationEnd={handleAnimationEnd}
                >
                    {/* Header */}
                    <div className="chat-header d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bot-avatar-icon">
                                <i className="bi bi-robot"></i>
                            </div>
                            <h6 className="mb-0 fw-bold">SEA Assistant</h6>
                        </div>
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm text-white chat-header-btn" onClick={resetBot} title="Restart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                            </button>
                            <button className="btn btn-sm text-white chat-header-btn" onClick={() => setIsClosing(true)} title="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Body */}
                    <div className="chat-body d-flex flex-column p-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                                <div className={`msg-bubble ${msg.sender === 'user' ? 'msg-user shadow-sm' : 'msg-bot shadow-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="d-flex justify-content-start mb-3">
                                <div className="msg-bubble msg-bot shadow-sm d-flex gap-1 align-items-center">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer / Options */}
                    <div className="chat-footer">
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                            {options.map((opt, idx) => (
                                <button 
                                    key={idx} 
                                    className="btn btn-sm rounded-pill bot-options-btn px-3 py-2"
                                    onClick={() => sendMessage(opt.keyword, opt.trigger)}
                                    disabled={loading}
                                >
                                    {opt.trigger}
                                </button>
                            ))}
                            {isFinal && (
                                <button className="btn w-100 rounded-pill bot-restart-btn px-3 py-2 mt-1" onClick={resetBot}>
                                    <i className="bi bi-arrow-counterclockwise me-2"></i> Start Over
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            
            {!isOpen && (
                <div className="bot-fab-idle position-relative">
                    {!isOpen && !isClosing && showHelp && (
                        <div
                            className="bot-help-bubble shadow-sm"
                            onClick={toggleBot}
                        >
                            {translations.bot?.needHelp || "Need help?"} 👋
                        </div>
                    )}
                    <button
                        className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center bot-fab-btn"
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