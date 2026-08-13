import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

import ProfileDetails from "./components/ProfileDetails";
import CertificatesList from "./components/CertificatesList";
import AccountSettings from "./components/AccountSettings";
import PasswordSettings from "./components/PasswordSettings";
import NotificationsPanel from "./components/NotificationsPanel";

export default function ProfilePage() {
  const { translations } = useLanguage();
  const t = translations.profile;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const tabs = [
    { id: "details", label: t.detailsTab },
    { id: "certificates", label: t.certificatesTab },
    { id: "account", label: t.accountTab || "الحساب" },
    { id: "notifications", label: t.Notifications || "Notifications" },
    { id: "security", label: t.securityTab },
  ];

  const activeLabel = tabs.find((t) => t.id === activeTab)?.label || "اختر تبويب";

  return (
    <div className="min-h-screen bg-[#fcfdfb] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[40px] md:text-[80px] font-[900] leading-[0.9] text-[#0e0f0c] tracking-tight mb-10 uppercase">
          {t.title}
          <br />
          {t.settings}
        </h1>

        <div className="w-full">
          <div className="relative mb-10 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between bg-white border border-[rgba(14,15,12,0.15)] rounded-2xl px-5 py-4 text-sm font-bold text-[#0e0f0c] shadow-sm hover:border-[#0d6efd] transition-all"
            >
              <span>{activeLabel}</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-[rgba(14,15,12,0.15)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsOpen(false);
                    }}
                    className={`px-5 py-3 text-sm font-medium cursor-pointer transition-colors ${
                      activeTab === tab.id ? "bg-[#9fe870] text-[#0e0f0c]" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex flex-wrap gap-3 mb-10 p-1.5 bg-gray-50/50 rounded-3xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold px-6 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#0e0f0c] text-[#9fe870] shadow-lg scale-105"
                    : "text-gray-500 hover:text-[#0e0f0c] hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "details" && <ProfileDetails />}
        {activeTab === "certificates" && <CertificatesList />}
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "notifications" && <NotificationsPanel />}
        {activeTab === "security" && <PasswordSettings />}
      </div>
    </div>
  );
}