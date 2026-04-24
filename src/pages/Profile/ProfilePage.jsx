// import React from "react";
// import { useProfile } from '../../hooks/useProfile';

// const ProfilePage = () => {
//   const { profile, loading, error } = useProfile();

//   if (loading) return <div className="text-center p-5">جاري التحميل...</div>;
//   if (error) return <div className="text-red-500 text-center p-5">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
//       <h2 className="text-2xl font-bold mb-6 text-center">الملف الشخصي</h2>

//       <div className="flex flex-col items-center mb-6">
//         {/* عرض الصورة الشخصية أو صورة افتراضية */}
//         <img
//           src={profile?.profile_pic || "https://via.placeholder.com/150"}
//           alt="Profile"
//           className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
//         />
//         <h3 className="mt-4 text-xl font-semibold">{profile?.name_ar}</h3>
//         <p className="text-gray-500">{profile?.department}</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="border-b pb-2">
//           <span className="block text-sm text-gray-400">اسم المستخدم</span>
//           <span className="font-medium">{profile?.username}</span>
//         </div>
//         <div className="border-b pb-2">
//           <span className="block text-sm text-gray-400">الرقم الجامعي</span>
//           <span className="font-medium">{profile?.uni_id}</span>
//         </div>
//         <div className="border-b pb-2">
//           <span className="block text-sm text-gray-400">البريد الإلكتروني</span>
//           <span className="font-medium">{profile?.email}</span>
//         </div>
//         <div className="border-b pb-2">
//           <span className="block text-sm text-gray-400">رقم الهاتف</span>
//           <span className="font-medium">{profile?.phone}</span>
//         </div>
//       </div>

//       <button
//         className="mt-8 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//         onClick={() => alert("سنقوم ببرمجة التعديل في الخطوة القادمة!")}
//       >
//         تعديل البيانات
//       </button>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState } from "react";
import { useProfileData, useCertificates } from "../../hooks/useProfile";
import SEA_loading from "../../components/ui/SEA_loading";
import { useLanguage } from "../../context/LanguageContext";
import { Fragment } from "react";

// مكون تفاصيل الملف الشخصي
function ProfileDetails({ profile, loading, error }) {
  const { translations } = useLanguage();
  const t = translations.profile;
  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 font-bold">
        {/* Loading Profile... */}
        {t.loadingProfile}
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">{error}</div>
    );

  if (!profile) return null;

  const styles = {
    card: "bg-white rounded-[30px] p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]",
    input:
      "w-full p-4 border border-[rgba(14,15,12,0.2)] rounded-[12px] outline-none font-semibold disabled:bg-gray-50",
    label:
      "block mb-2 font-bold text-xs text-gray-400 uppercase tracking-widest",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="space-y-6">
        <div className={`${styles.card} text-center`}>
          <div className="relative w-40 h-40 mx-auto">
            <div className="w-full h-full rounded-full bg-[#e2f6d5] border-4 border-[#0d6efd] flex items-center justify-center overflow-hidden">
              {profile?.profile_pic ? (
                <img
                  src={profile.profile_pic}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black uppercase">
                  {profile?.name_en?.substring(0, 2)}
                </span>
              )}
            </div>
          </div>
          <h3 className="mt-4 font-black text-xl">{profile?.name_en}</h3>
          <p className="text-[#868685] font-bold">{profile?.department}</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className={styles.card}>
          <h2 className="text-2xl font-black mb-8">{t.personalInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={styles.label}>{t.nameAr}</label>
              <input
                className={styles.input}
                value={profile?.name_ar || ""}
                disabled
              />
            </div>
            <div>
              <label className={styles.label}>{t.email}</label>
              <input
                className={styles.input}
                value={profile?.email || ""}
                disabled
              />
            </div>
            <div>
              <label className={styles.label}>{t.phone}</label>
              <input
                className={styles.input}
                value={profile?.phone || ""}
                disabled
              />
            </div>
            <div>
              <label className={styles.label}>{t.department}</label>
              <input
                className={styles.input}
                value={profile?.department || ""}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون قائمة الشهادات
function CertificatesList({ certificates, loading, error }) {
  const { translations, language } = useLanguage(); //
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
      <div className="p-10 text-center text-gray-500 font-bold">
        {/* Loading Certificates... */}
        {t.loading}
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
          {/* Explore Courses */}
          {t.exploreCourses}
        </button>
      </div>
    );
  }

  const styles = {
    container: "grid grid-cols-1 md:grid-cols-2 gap-8",
    card: "group relative bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out overflow-hidden",
    topLine:
      "absolute top-0 left-0 w-full h-1.5 bg-[#0d6efd] transform origin-left scale-x-100 group-hover:scale-x-110 transition-transform duration-500",
    label:
      "text-[11px] uppercase tracking-[0.15em] text-gray-400 font-black mb-1",
    value: "text-base font-bold text-[#0e0f0c]",
    badge: (status) =>
      `px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
        status === "active"
          ? "bg-green-500 shadow-green-100"
          : "bg-blue-600 shadow-blue-100"
      } shadow-lg`,
    iconBox:
      "w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500",
  };

  return (
    <div className={styles.container}>
      {certificates.map((cert, index) => (
        <div key={cert.Hash || index} className={styles.card}>
          {/* خط التزيين العلوي */}
          <div className={styles.topLine} />

          <div className="flex justify-between items-start mb-8">
            <div>
              {/* أيقونة جمالية */}
              <div className={styles.iconBox}>
                <svg
                  className="w-6 h-6 text-[#0d6efd]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className={styles.label}>{t.certId}</p>
              <h3 className="text-3xl font-black italic tracking-tight text-[#0e0f0c]">
                #{cert.EventID}
              </h3>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={styles.badge(cert.Status)}>
                <span className="text-white">{cert.Status}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
            <div>
              <div className="flex items-center  gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <p className={styles.label}>{t.grade}</p>
              </div>
              <p className="text-2xl font-black text-[#0d6efd]">
                {cert.Grade}
                <span className="text-sm ml-0.5">%</span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                <p className={styles.label}>{t.issueDate}</p>
              </div>
              <p className={styles.value}>{formatDate(cert.IssueDate)}</p>
            </div>
          </div>

          {/* <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-[#0d6efd] hover:text-white hover:border-solid transition-all duration-300">
            View Certificate Details
          </button> */}
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
    const { translations } = useLanguage(); 
    const t = translations.profile;

  const [activeTab, setActiveTab] = useState("details");

  const profileHook = useProfileData();
  const certsHook = useCertificates();

  const styles = {
    heading:
      "text-[40px] md:text-[86px] font-[900] leading-[0.85] text-[#0e0f0c] tracking-tight mb-10 uppercase",
    tabBtn: (active) =>
      `text-xl font-black capitalize transition-all pb-2 ${active ? "text-[#0e0f0c] border-b-4 border-[#0d6efd]" : "text-gray-300"}`,
  };

  return (
    <div className="min-h-screen  bg-[#fcfdfb] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className={styles.heading}>
          {t.title}
          <br />
          {t.settings}
        </h1>

        <div className="flex gap-8 mb-10 border-b border-gray-100">
          {["details", "certificates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={styles.tabBtn(activeTab === tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <ProfileDetails
            profile={profileHook.profile}
            loading={profileHook.loading}
            error={profileHook.error}
          />
        )}

        {activeTab === "certificates" && (
          <CertificatesList
            certificates={certsHook.certificates}
            loading={certsHook.loading}
            error={certsHook.error}
          />
        )}
      </div>
    </div>
  );
}
