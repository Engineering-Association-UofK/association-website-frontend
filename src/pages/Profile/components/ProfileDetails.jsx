import React, { useState } from "react";
import { useProfileData, useUpdateProfilePicture, useUpdateProfileData } from "../../../hooks/useProfile";
import SEA_loading from "../../../components/ui/SEA_loading";
import { useLanguage } from "../../../context/LanguageContext";
import { BsCameraFill } from "react-icons/bs";
import StatusMessage from "./StatusMessage";
import { S } from "../../../styles/profileStyles";

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

export default function ProfileDetails() {
  const { profile, loading, error, refreshProfile } = useProfileData();
  const { translations } = useLanguage();
  const t = translations.profile;

  const { updatePicture, loading: updatingPic, status: picStatus, resetStatus: resetPicStatus } = useUpdateProfilePicture();
  const { updateProfile, loading: updatingData, status: dataStatus, resetStatus: resetDataStatus } = useUpdateProfileData();

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

  if (loading) return <div className="p-10 text-center"><SEA_loading /></div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div className={`${S.card} text-center`}>
          <div className="relative w-36 h-36 mx-auto group mb-5">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#e2f6d5] to-[#c8edff] border-[3px] border-[#0d6efd]/30 flex items-center justify-center overflow-hidden shadow-inner">
              {updatingPic ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d6efd]" />
              ) : profile?.profile_pic ? (
                <img src={profile.profile_pic} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black uppercase text-[#0d6efd]">
                  {profile?.name_en?.substring(0, 2)}
                </span>
              )}
            </div>
            <label className="absolute bottom-1 right-1 flex items-center justify-center p-2 bg-[#0d6efd] rounded-full border-2 border-white cursor-pointer hover:bg-[#0b5ed7] transition-all shadow-lg group-hover:scale-110">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={updatingPic} />
              <BsCameraFill size={16} className="text-white" />
            </label>
          </div>

          <div className="h-5 mb-3">
            {picStatus.msg && (
              <p className={`text-[11px] font-bold ${picStatus.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {picStatus.msg}
              </p>
            )}
          </div>

          <h3 className="font-black text-lg text-[#0e0f0c]">{profile?.name_en}</h3>
          <p className="text-[#868685] font-semibold text-xs uppercase tracking-wider mt-1">{profile?.department}</p>
          <div className="mt-4 inline-block bg-[#0e0f0c] text-[#9fe870] text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest">
            ID #{profile?.id}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className={S.card}>
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-xl font-black text-[#0e0f0c]">{t.personalInfo}</h2>
            {!isEditMode ? (
              <button onClick={handleStartEdit} className="flex items-center gap-1.5 text-[#0d6efd] font-bold text-xs border border-[#0d6efd]/30 px-4 py-2 rounded-lg hover:bg-[#0d6efd]/5 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t.editProfile}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => { setIsEditMode(false); resetDataStatus(); }} className="text-xs font-bold uppercase text-gray-400 hover:text-red-500 transition-colors">
                  {t.cancel || "إلغاء"}
                </button>
                <button onClick={handleSaveData} disabled={updatingData} className="bg-[#0e0f0c] text-[#9fe870] text-xs font-black px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-wider">
                  {updatingData ? t.saving || "جاري الحفظ..." : t.save || "حفظ"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={S.label}>{t.nameAr}</label>
              <input className={S.input} value={isEditMode ? formData.name_ar : profile?.name_ar || ""} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} disabled={!isEditMode} />
            </div>
            <div>
              <label className={S.label}>{t.nameEn || "English Name"}</label>
              <input className={S.input} value={isEditMode ? formData.name_en : profile?.name_en || ""} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} disabled={!isEditMode} />
            </div>
            <div>
              <label className={S.label}>{t.Gender || "Gender"}</label>
              <select className={S.select} value={isEditMode ? formData.gender : profile?.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} disabled={!isEditMode}>
                <option value="male">ذكر (Male)</option>
                <option value="female">أنثى (Female)</option>
              </select>
            </div>
            <div>
              <label className={S.label}>{t.phone}</label>
              <input className={S.input} value={isEditMode ? formData.phone : profile?.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditMode} />
            </div>
            <div>
              <label className={S.label}>{t.UniversityID}</label>
              <input type="number" className={S.input} value={isEditMode ? formData.uni_id : profile?.uni_id || ""} onChange={(e) => setFormData({ ...formData, uni_id: e.target.value })} disabled={!isEditMode} />
            </div>
            <div>
              <label className={S.label}>{t.department}</label>
              <select className={S.select} value={isEditMode ? formData.department : profile?.department || ""} onChange={(e) => setFormData({ ...formData, department: e.target.value })} disabled={!isEditMode}>
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
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