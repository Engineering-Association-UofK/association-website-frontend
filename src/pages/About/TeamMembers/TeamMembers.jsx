import React from 'react';
import { Container } from 'react-bootstrap';
import { useLanguage } from '../../../context/LanguageContext';
import { useTeam } from '../../../features/team/hooks/useTeam';
import './TeamMembers.css';

const TeamMembers = () => {
    const { language } = useLanguage();
    const { data, isLoading, error } = useTeam();

    const sortedMembers = data ? [...data].sort((a, b) => a.display_order - b.display_order) : [];

    const SkeletonLoader = () => (
        <div className="skeleton-grid">
            {[...Array(12)].map((_, idx) => (
                <div key={idx} className="skeleton-card">
                    <div className="skeleton-img"></div>
                    <div className="skeleton-text">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>
                        <div className="skeleton-line"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (isLoading || error) { // TODO: The error must not be like that XD
        return (
            <div className="team-members-page">
                <Container className="py-5">
                    <h1 className="text-center fw-bold mb-5 text-primary">
                        {language === 'en' ? 'Our Team' : 'فريق العمل'}
                    </h1>
                    <SkeletonLoader />
                </Container>
            </div>
        );
    }

    return (
        <div className="team-members-page">
            <Container className="py-5">
                <h1 className="text-center fw-bold mb-5 text-primary">
                    {language === 'en' ? 'Our Team' : 'فريق العمل'}
                </h1>

                <div className="team-grid">
                    {sortedMembers.map((member) => (
                        <div key={member.user_id} className="member-card">
                            <img
                                src={member.profile_pic || `https://ui-avatars.com/api/?background=0d6efd&color=fff&name=${encodeURIComponent(language === 'en' ? member.name_en[0] : member.name_ar[0])}`}
                                alt="member-name"
                                className="member-img"
                            />
                            <div className="member-info">
                                <h3 className="member-name">
                                    {language === 'en' ? member.name_en : member.name_ar}
                                </h3>
                                <p className="member-role">{member.role}</p>
                                <p className="member-bio">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default TeamMembers;