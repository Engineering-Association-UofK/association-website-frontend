import React from 'react';
import './CertificateVerification.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CertificateVerification = ({
    isValid,
    issuedTo,
    event,
    issueDate,
    studentId,
    qrCodeUrl // Optional URL for the QR code image
}) => {
    return (
        <div className={`verified-record-card ${isValid ? 'valid' : 'invalid'}`}>
            {/* Verify Ribbon */}
            <div className={`status-ribbon ${isValid ? 'valid' : 'invalid'}`}>
                <div className="status-icon-container">
                    <i className={`bi ${isValid ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} status-icon`}></i>
                </div>
                <div className="status-text">
                    <h2>{isValid ? 'Verified Record' : 'Invalid Record'}</h2>
                    <p>
                        {isValid
                            ? 'This certificate is officially recognized by the University Association.'
                            : 'This certificate record could not be verified or does not exist.'}
                    </p>
                </div>
            </div>

            <div className="verification-details">
                {/* Details Card */}
                <div className="details-card">
                    <div className="detail-row">
                        <div className="detail-icon">
                            <i className="bi bi-person"></i>
                        </div>
                        <div className="detail-content">
                            <span className="detail-value">{issuedTo}</span>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-icon">
                            <i className="bi bi-calendar-event"></i>
                        </div>
                        <div className="detail-content">
                            <span className="detail-value">{event}</span>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-icon">
                            <i className="bi bi-clock"></i>
                        </div>
                        <div className="detail-content">
                            <span className="detail-label">Date of Completion:</span>
                            <span className="detail-value">{issueDate}</span>
                        </div>
                    </div>
                </div>

                {/* QR Code Card */}
                <div className="qr-card">
                    {/* Use a placeholder if no URL provided */}
                    <img
                        src={qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExampleVerification"}
                        alt="Verification QR Code"
                        className="qr-code-img"
                    />
                    <span className="qr-label">Scan to Verify</span>
                </div>
            </div>

            {studentId && (
                <div className="id-section">
                    <i className="bi bi-card-heading"></i>
                    <span>University ID: {studentId}</span>
                </div>
            )}
        </div>
    );
};

export default CertificateVerification;
