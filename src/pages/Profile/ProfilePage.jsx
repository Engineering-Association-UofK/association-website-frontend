import React, { useState } from "react";
import {
  useProfileData,
  useCertificates,
  useUpdatePassword,
  useUpdateProfilePicture,
  useUpdateProfileData,
  useUpdateUsername,
  useUpdateEmail,
} from "../../hooks/useProfile";
import SEA_loading from "../../components/ui/SEA_loading";
import { useLanguage } from "../../context/LanguageContext";
import { Fragment } from "react";
import { BsCameraFill } from "react-icons/bs";

// ─────────────────────────────────────────────────────────────────────────────
// section one 
// ─────────────────────────────────────────────────────────────────────────────
function StatusMessage({ status }) {
  if (!status?.msg) return null;
  const isSuccess = status.type === "success";
  return (
    <div
      className={`mt-4 p-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
        isSuccess
          ? "bg-green-50 text-green-700 border border-green-100"
          : "bg-red-50 text-red-600 border border-red-100"
      }`}
    >
      {isSuccess ? (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{status.msg}</span>
    </div>
  );
}


const DEPARTMENTS = [
  { value: "surveying", label: "Surveying Engineering" },
  { value: "agricultural", label: "Agricultural Engineering" },
  { value: "civil", label: "Civil Engineering" },
  { value: "electrical", label: "Electrical and Electronics Engineering" },
  { value: "mechanical", label: "Mechanical Engineering" },
  { value: "mining", label: "Mining Engineering" },
  { value: "chemical", label: "Chemical Engineering" },
  { value: "petroleum", label: "Petroleum Engineering" },
];

function ProfileDetails({ profile, loading, error, refreshProfile }) {
  const { translations } = useLanguage();
  const t = translations.profile;

  const {
    updatePicture,
    loading: updatingPic,
    status: picStatus,
    resetStatus: resetPicStatus,
  } = useUpdateProfilePicture();

  const {
    updateProfile,
    loading: updatingData,
    status: dataStatus,
    resetStatus: resetDataStatus,
  } = useUpdateProfileData();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const handleStartEdit = () => {
    setFormData({
      name_ar: profile?.name_ar || "",
      name_en: profile?.name_en || "",
      phone: profile?.phone || "",
      department: profile?.department || "",
      gender: profile?.gender || "male",
      uni_id: Number(profile?.uni_id) || 0,
      id: Number(profile?.id) || 0,
    });
    setIsEditMode(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const success = await updatePicture(file);
      if (success && refreshProfile) refreshProfile();
      setTimeout(resetPicStatus, 3000);
    }
  };

  const handleSaveData = async () => {
    const success = await updateProfile(formData);
    if (success) {
      if (refreshProfile) refreshProfile();
      setTimeout(() => {
        setIsEditMode(false);
        resetDataStatus();
      }, 2000);
    } else {
      setTimeout(resetDataStatus, 4000);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        <SEA_loading />
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">{error}</div>
    );
  if (!profile) return null;

  const S = {
    card: "bg-white rounded-[28px] p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.08)] hover:shadow-[0_8px_32px_rgba(14,15,12,0.08)] transition-shadow duration-300",
    input:
      "w-full p-3.5 border border-[rgba(14,15,12,0.15)] rounded-[10px] outline-none font-semibold text-sm transition-all focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/10 disabled:bg-gray-50 disabled:text-gray-400",
    label: "block mb-1.5 font-bold text-[11px] text-gray-400 uppercase tracking-widest",
    select:
      "w-full p-3.5 border border-[rgba(14,15,12,0.15)] rounded-[10px] outline-none font-semibold text-sm appearance-none bg-white transition-all focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/10 disabled:bg-gray-50 disabled:text-gray-400",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div className={`${S.card} text-center`}>
          <div className="relative w-36 h-36 mx-auto group mb-5">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#e2f6d5] to-[#c8edff] border-[3px] border-[#0d6efd]/30 flex items-center justify-center overflow-hidden shadow-inner">
              {updatingPic ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d6efd]" />
              ) : profile?.profile_pic ? (
                <img
                  src={profile.profile_pic}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black uppercase text-[#0d6efd]">
                  {profile?.name_en?.substring(0, 2)}
                </span>
              )}
            </div>
            <label className="absolute bottom-1 right-1 flex items-center justify-center p-2 bg-[#0d6efd] rounded-full border-2 border-white cursor-pointer hover:bg-[#0b5ed7] transition-all shadow-lg group-hover:scale-110">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={updatingPic}
              />
              <BsCameraFill size={16} className="text-white" />
            </label>
          </div>

          <div className="h-5 mb-3">
            {picStatus.msg && (
              <p
                className={`text-[11px] font-bold ${
                  picStatus.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {picStatus.msg}
              </p>
            )}
          </div>

          <h3 className="font-black text-lg text-[#0e0f0c]">
            {profile?.name_en}
          </h3>
          <p className="text-[#868685] font-semibold text-xs uppercase tracking-wider mt-1">
            {profile?.department}
          </p>

          <div className="mt-4 inline-block bg-[#0e0f0c] text-[#9fe870] text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest">
            ID #{profile?.id}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className={S.card}>
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-xl font-black text-[#0e0f0c]">
              {t.personalInfo}
            </h2>
            {!isEditMode ? (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 text-[#0d6efd] font-bold text-xs border border-[#0d6efd]/30 px-4 py-2 rounded-lg hover:bg-[#0d6efd]/5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t.editProfile}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setIsEditMode(false); resetDataStatus(); }}
                  className="text-xs font-bold uppercase text-gray-400 hover:text-red-500 transition-colors"
                >
                  {t.cancel || "إلغاء"}
                </button>
                <button
                  onClick={handleSaveData}
                  disabled={updatingData}
                  className="bg-[#0e0f0c] text-[#9fe870] text-xs font-black px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-wider"
                >
                  {updatingData ? (t.saving || "جاري الحفظ...") : (t.save || "حفظ")}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={S.label}>{t.nameAr}</label>
              <input
                className={S.input}
                value={isEditMode ? formData.name_ar : profile?.name_ar || ""}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <label className={S.label}>{t.nameEn || "English Name"}</label>
              <input
                className={S.input}
                value={isEditMode ? formData.name_en : profile?.name_en || ""}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <label className={S.label}>{t.Gender || "Gender"}</label>
              <select
                className={S.select}
                value={isEditMode ? formData.gender : profile?.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={!isEditMode}
              >
                <option value="male">ذكر (Male)</option>
                <option value="female">أنثى (Female)</option>
              </select>
            </div>
            <div>
              <label className={S.label}>{t.phone}</label>
              <input
                className={S.input}
                value={isEditMode ? formData.phone : profile?.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <label className={S.label}>{t.UniversityID}</label>
              <input
                type="number"
                className={S.input}
                value={isEditMode ? formData.uni_id : profile?.uni_id || ""}
                onChange={(e) => setFormData({ ...formData, uni_id: e.target.value })}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <label className={S.label}>{t.department}</label>
              <select
                className={S.select}
                value={isEditMode ? formData.department : profile?.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={!isEditMode}
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <StatusMessage status={dataStatus} />
        </div>
      </div>
    </div>
  );
}


function AccountSettings({ profile, refreshProfile }) {
    const { translations } = useLanguage();
    const t = translations.profile;
  // ── Username ──
  const {
    updateUsername,
    loading: loadingUsername,
    status: usernameStatus,
    resetStatus: resetUsernameStatus,
  } = useUpdateUsername();


  const {
    updateEmail,
    loading: loadingEmail,
    status: emailStatus,
    resetStatus: resetEmailStatus,
  } = useUpdateEmail();

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

  const S = {
    card: "bg-white rounded-[28px] p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.08)] hover:shadow-[0_8px_32px_rgba(14,15,12,0.08)] transition-shadow duration-300",
    input:
      "w-full p-3.5 border border-[rgba(14,15,12,0.15)] rounded-[10px] outline-none font-semibold text-sm transition-all focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/10",
    label: "block mb-1.5 font-bold text-[11px] text-gray-400 uppercase tracking-widest",
    btn: "bg-[#0e0f0c] text-[#9fe870] font-black text-xs py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-wider",
    currentValue: "text-xs text-gray-400 font-semibold mt-1.5 flex items-center gap-1.5",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className={S.card}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0d6efd]/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#0d6efd]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-base text-[#0e0f0c]">
              {t.UpdateName}
            </h3>
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
            <input
              type="text"
              className={S.input}
              placeholder={t.ussernameedit}
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                resetUsernameStatus();
              }}
              disabled={loadingUsername}
              required
            />
          </div>
          <StatusMessage status={usernameStatus} />
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loadingUsername || !newUsername.trim()}
              className={S.btn}
            >
              {loadingUsername ? t.password.updatingBtn : t.Updateuse}
            </button>
          </div>
        </form>
      </div>

      <div className={S.card}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#9fe870]/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#4a8a1a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-base text-[#0e0f0c]">
              {t.enternewname}
            </h3>
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
            <input
              type="email"
              className={S.input}
              placeholder="example@email.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                resetEmailStatus();
              }}
              disabled={loadingEmail}
              required
            />
          </div>
          <StatusMessage status={emailStatus} />
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loadingEmail || !newEmail.trim()}
              className={S.btn}
            >
              {loadingEmail ? t.password.updatingBtn : t.Updateemail}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CertificatesList({ certificates, loading, error }) {
  const { translations, language } = useLanguage();
  const t = translations.profile;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        <SEA_loading />
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">{error}</div>
    );

  if (!certificates || certificates.length === 0) {
    return (
      <div className="bg-[#f8f9f7] rounded-[40px] p-16 text-center border-2 border-dashed border-gray-200">
        <h2 className="text-3xl font-black mb-3 italic">{t.noCerts}</h2>
        <button className="bg-[#0e0f0c] text-[#9fe870] font-bold py-4 px-10 rounded-full mt-4">
          {t.exploreCourses}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
      {certificates.map((cert, index) => (
        <div
          key={cert.Hash || index}
          className="group relative bg-white rounded-[28px] p-7 shadow-[0_0_0_1px_rgba(14,15,12,0.08)] hover:shadow-[0_16px_40px_rgba(13,110,253,0.1)] transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0d6efd] to-[#9fe870]" />

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-[#0d6efd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-0.5">
                {t.certId}
              </p>
              <h3 className="text-2xl font-black italic tracking-tight text-[#0e0f0c]">
                #{cert.EventID}
              </h3>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${
                cert.Status === "active" ? "bg-green-500" : "bg-blue-600"
              }`}
            >
              {cert.Status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">
                {t.grade}
              </p>
              <p className="text-2xl font-black text-[#0d6efd]">
                {cert.Grade}<span className="text-xs ml-0.5">%</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">
                {t.issueDate}
              </p>
              <p className="text-sm font-bold text-[#0e0f0c]">
                {formatDate(cert.IssueDate)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


function PasswordSettings() {
  const { translations } = useLanguage();
  const t = translations.profile.password;

  const { updatePassword, loading, status, resetStatus } = useUpdatePassword();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await updatePassword(formData);
    if (isSuccess) {
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
      setTimeout(resetStatus, 3000);
    }
  };

  if (loading) {
    return (
      <Fragment>
        <SEA_loading />
      </Fragment>
    );
  }

  const S = {
    card: "bg-white rounded-[28px] p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.08)] hover:shadow-[0_8px_32px_rgba(14,15,12,0.08)] transition-shadow duration-300",
    input:
      "w-full p-3.5 border border-[rgba(14,15,12,0.15)] rounded-[10px] outline-none font-semibold text-sm focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/10 transition-all",
    label: "block mb-1.5 font-bold text-[11px] text-gray-400 uppercase tracking-widest",
    btn: "bg-[#0e0f0c] text-[#9fe870] font-black text-xs py-3.5 px-8 rounded-lg mt-6 hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-wider",
  };

  return (
    <div className="max-w-2xl">
      <div className={S.card}>
        {/* رأس */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0e0f0c] italic uppercase">
              {t.securityTitle || "Security Settings"}
            </h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              Update your password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={S.label}>{t.oldPassword}</label>
            <input
              type="password"
              placeholder="••••••••"
              className={S.input}
              value={formData.old_password}
              onChange={(e) => {
                resetStatus();
                setFormData({ ...formData, old_password: e.target.value });
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={S.label}>{t.newPassword}</label>
              <input
                type="password"
                placeholder="••••••••"
                className={S.input}
                value={formData.new_password}
                onChange={(e) =>
                  setFormData({ ...formData, new_password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className={S.label}>{t.confirmPassword}</label>
              <input
                type="password"
                placeholder="••••••••"
                className={S.input}
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          <StatusMessage status={status} />

          <button type="submit" disabled={loading} className={S.btn}>
            {loading ? (t.updatingBtn || "Updating...") : (t.updateBtn || "Update Password")}
          </button>
        </form>
      </div>
    </div>
  );
}


export default function ProfilePage() {
  const { translations } = useLanguage();
  const t = translations.profile;

  // التبويبات: details | certificates | account | security
  const [activeTab, setActiveTab] = useState("details");

  const profileHook = useProfileData();
  const certsHook = useCertificates();

  const tabs = [
    { id: "details",      label: t.detailsTab },
    { id: "certificates", label: t.certificatesTab },
    {
      id: "account",
      label: t.accountTab || "الحساب",        // ← تبويب جديد
    },
    { id: "security",     label: t.securityTab },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfb] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* العنوان الكبير */}
        <h1 className="text-[40px] md:text-[80px] font-[900] leading-[0.9] text-[#0e0f0c] tracking-tight mb-10 uppercase">
          {t.title}
          <br />
          {t.settings}
        </h1>

        {/* التبويبات */}
        <div className="flex gap-6 mb-10 border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-base font-black capitalize transition-all pb-2.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#0e0f0c] border-b-[3px] border-[#0d6efd]"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* محتوى التبويبات */}
        {activeTab === "details" && (
          <ProfileDetails
            profile={profileHook.profile}
            loading={profileHook.loading}
            error={profileHook.error}
            refreshProfile={profileHook.refreshProfile}
          />
        )}

        {activeTab === "certificates" && (
          <CertificatesList
            certificates={certsHook.certificates}
            loading={certsHook.loading}
            error={certsHook.error}
          />
        )}

        {/*
         * ── تبويب الحساب الجديد ──
         * يعرض: تغيير Username + تغيير Email
         */}
        {activeTab === "account" && (
          <div className="space-y-8">
            {/* عنوان فرعي */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-[#0d6efd] rounded-full" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Account Credentials
              </p>
            </div>
            <AccountSettings
              profile={profileHook.profile}
              refreshProfile={profileHook.refreshProfile}
            />
          </div>
        )}

        {activeTab === "security" && <PasswordSettings />}
      </div>
    </div>
  );
}
