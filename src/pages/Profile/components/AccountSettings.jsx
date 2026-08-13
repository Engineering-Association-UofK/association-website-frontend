import React, { useState } from "react";
import { useProfileData, useUpdateUsername, useUpdateEmail } from "../../../hooks/useProfile";
import SEA_loading from "../../../components/ui/SEA_loading";
import { useLanguage } from "../../../context/LanguageContext";
import StatusMessage from "./StatusMessage";
import { S } from "../../../styles/profileStyles";

export default function AccountSettings() {
  const { profile, loading: profileLoading, refreshProfile } = useProfileData();
  const { translations } = useLanguage();
  const t = translations.profile;

  const { updateUsername, loading: loadingUsername, status: usernameStatus, resetStatus: resetUsernameStatus } = useUpdateUsername();
  const { updateEmail, loading: loadingEmail, status: emailStatus, resetStatus: resetEmailStatus } = useUpdateEmail();

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUsername(newUsername);
    if (success) {
      setNewUsername("");
      if (refreshProfile) refreshProfile();
      setTimeout(resetUsernameStatus, 3000);
    } else {
      setTimeout(resetUsernameStatus, 4000);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const success = await updateEmail(newEmail);
    if (success) {
      setNewEmail("");
      if (refreshProfile) refreshProfile();
      setTimeout(resetEmailStatus, 3000);
    } else {
      setTimeout(resetEmailStatus, 4000);
    }
  };

  if (profileLoading) return <div className="p-10 text-center"><SEA_loading /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-[#0d6efd] rounded-full" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Account Credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={S.card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0d6efd]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0d6efd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-base text-[#0e0f0c]">{t.UpdateName}</h3>
            </div>
          </div>

          {profile?.username && (
            <div className={S.currentValue}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {t.crunt}:<span className="text-[#0e0f0c]">{profile.username}</span>
            </div>
          )}

          <form onSubmit={handleUsernameSubmit} className="mt-5 space-y-4">
            <div>
              <label className={S.label}>{t.ussernameedit}</label>
              <input type="text" className={S.input} placeholder={t.ussernameedit} value={newUsername} onChange={(e) => { setNewUsername(e.target.value); resetUsernameStatus(); }} disabled={loadingUsername} required />
            </div>
            <StatusMessage status={usernameStatus} />
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={loadingUsername || !newUsername.trim()} className={S.btn}>
                {loadingUsername ? t.password.updatingBtn : t.Updateuse}
              </button>
            </div>
          </form>
        </div>

        <div className={S.card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#9fe870]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#4a8a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-base text-[#0e0f0c]">{t.enternewname}</h3>
            </div>
          </div>

          {profile?.email && (
            <div className={S.currentValue}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {t.crunt}: <span className="text-[#0e0f0c]">{profile.email}</span>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
            <div>
              <label className={S.label}>{t.emailnew}</label>
              <input type="email" className={S.input} placeholder="example@email.com" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); resetEmailStatus(); }} disabled={loadingEmail} required />
            </div>
            <StatusMessage status={emailStatus} />
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={loadingEmail || !newEmail.trim()} className={S.btn}>
                {loadingEmail ? t.password.updatingBtn : t.Updateemail}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}