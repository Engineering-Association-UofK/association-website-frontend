import React from "react";
import { useNavigate } from "react-router-dom";
import { useCertificates, useDownloadCertificate } from "../../../hooks/useProfile";
import SEA_loading from "../../../components/ui/SEA_loading";
import { useLanguage } from "../../../context/LanguageContext";

export default function CertificatesList() {
  const { certificates, loading, error } = useCertificates();
  const { downloadCertificate, downloadingHash } = useDownloadCertificate();
  const { translations, language } = useLanguage();
  const navigate = useNavigate();
  const t = translations.profile;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(
      language === "ar" ? "ar-EG" : "en-GB",
      { day: "numeric", month: "short", year: "numeric" }
    );
  };

  if (loading) return <div className="p-10 text-center"><SEA_loading /></div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  if (!Array.isArray(certificates) || certificates.length === 0) {
    return (
      <div className="bg-[#f8f9f7] rounded-[40px] p-16 text-center border-2 border-dashed border-gray-200">
        <h2 className="text-3xl font-black mb-3 italic">{t.noCerts || "No certificates earned yet"}</h2>
        <button 
          onClick={() => navigate("/events")} 
          className="bg-[#0e0f0c] text-[#9fe870] font-bold py-4 px-10 rounded-full mt-4 hover:opacity-90 transition-all"
        >
          {t.exploreCourses || "Explore Events"}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
      {certificates.map((cert, index) => {
        const isDownloading = downloadingHash === cert.hash;

        return (
          <div
            key={cert.hash || index}
            className="group relative bg-white rounded-[28px] p-7 shadow-[0_0_0_1px_rgba(14,15,12,0.08)] hover:shadow-[0_16px_40px_rgba(13,110,253,0.1)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0d6efd] to-[#9fe870]" />

            <div>
              {/* Header Info */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#0d6efd] bg-blue-50 px-2.5 py-1 rounded-md">
                    {cert.type || "Certificate"}
                  </span>
                  <h3 className="text-xl font-black text-[#0e0f0c] mt-2 leading-snug">
                    {cert.event_name || "Event Certificate"}
                  </h3>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${
                    cert.status?.toLowerCase() === "active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {cert.status}
                </span>
              </div>

              {/* Details Badges */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 my-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                    {t.grade || "Grade"}
                  </p>
                  <p className="text-xl font-black text-[#0e0f0c]">
                    {cert.grade === 0 ? 100 : cert.grade}<span className="text-xs font-semibold text-gray-400 ml-0.5">%</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                    {t.issueDate || "Issued"}
                  </p>
                  <p className="text-sm font-bold text-[#0e0f0c] mt-1">
                    {formatDate(cert.issue_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {/* Download Certificate Button */}
              <button
                onClick={() => downloadCertificate(cert.hash)}
                disabled={isDownloading}
                className="flex-1 bg-[#0e0f0c] text-[#9fe870] font-black text-xs py-3 px-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {isDownloading ? (
                  <span className="animate-pulse">Downloading...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </>
                )}
              </button>

              {/* View Event Modal Button */}
              {cert.event_id && (
                <button
                  onClick={() => navigate(`/events?eventId=${cert.event_id}`)}
                  className="bg-gray-100 text-[#0e0f0c] font-extrabold text-xs py-3 px-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider border border-gray-200"
                >
                  <span>Event</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}