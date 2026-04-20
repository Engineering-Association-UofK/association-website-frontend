import React from "react";
import { useProfile } from "../../hooks/useProfile";
import { useState } from "react";
import Skeleton from "../../components/Skeleton";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const {
    userData,
    setUserData,
    certificates,
    loading,
    isEditing,
    setIsEditing,
    handleUpdate,
    handlePictureUpdate,
    passwordData,
    setPasswordData,
    handlePasswordUpdate,
  } = useProfile();

  if (loading)
    return (
      <>
        <Skeleton />
      </>
    );
  console.log(userData);
  
  if (!userData) {
    return (
      <div className="text-center p-20 ">
        <h2 className="text-2xl font-bold">Failed to load profile data.</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const styles = {
    heading:
      "text-[40px] md:text-[86px] font-[900] leading-[0.85] text-[#0e0f0c] tracking-tight mb-10 uppercase",
    card: "bg-white rounded-[30px] p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]",
    input:
      "w-full p-4 border border-[rgba(14,15,12,0.2)] rounded-[12px] focus:ring-1 focus:ring-inset focus:ring-[#9fe870] outline-none transition-all font-semibold disabled:bg-gray-50 disabled:text-gray-400",
    label:
      "block mb-2 font-bold text-xs text-gray-400 uppercase tracking-widest",
    btnPrimary:
      "bg-[#9fe870] text-[#163300] font-bold py-4 px-10 rounded-full transition-transform hover:scale-[1.05] active:scale-[0.95]",
    tabBtn: (active) =>
      `text-xl font-black capitalize transition-all pb-2 ${active ? "text-[#0e0f0c] border-b-4 border-[#9fe870]" : "text-gray-300"}`,
  };

  return (
    <div className="min-h-screen bg-[#fcfdfb] p-6 md:p-12 font-['Inter'] ">
      <div className="max-w-6xl mx-auto">
        <h1 className={styles.heading}>
          PROFILE
          <br />
          SETTINGS
        </h1>

        <div className="flex gap-8 mb-10 overflow-x-auto pb-2 border-b border-gray-100">
          {["details", "certificates", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={styles.tabBtn(activeTab === tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div className={`${styles.card} text-center`}>
              <div className="relative w-40 h-40 mx-auto group">
                <div className="w-full h-full rounded-full bg-[#e2f6d5] border-4 border-[#9fe870] flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-black uppercase">
                    {userData.name_en?.substring(0, 2) || "MK"}
                  </span>
                </div>
                <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-100">
                  📷
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePictureUpdate(e.target.files[0])}
                  />
                </label>
              </div>
              <h3 className="mt-4 font-black text-xl text-[#0e0f0c]">
                {userData.name_en}
              </h3>
              <p className="text-[#868685] font-bold">
                {userData.department || "Student"}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeTab === "details" && (
              <div className={styles.card}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black">Personal Info</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="font-bold text-[#054d28] underline"
                  >
                    {isEditing ? "Cancel" : "Edit Info"}
                  </button>
                </div>

                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className={styles.label}>Name (English)</label>
                    <input
                      className={styles.input}
                      value={userData.name_en || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setUserData({ ...userData, name_en: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className={styles.label}>الأسم (عربي)</label>
                    <input
                      className={styles.input}
                      value={userData.name_ar || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setUserData({ ...userData, name_ar: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      className={styles.input}
                      value={userData.phone || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Department</label>
                    <input
                      className={styles.input}
                      value={userData.department || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setUserData({ ...userData, department: e.target.value })
                      }
                    />
                  </div>

                  {isEditing && (
                    <div className="md:col-span-2 pt-4">
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className={styles.btnPrimary}
                      >
                        Update Profile
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-black">Your Achievements</h2>
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert, index) => (
                      <div
                        key={index}
                        className={`${styles.card} border-l-8 border-[#9fe870]`}
                      >
                        <h3 className="text-xl font-black">{cert.name}</h3>
                        <p className="text-gray-500 font-bold">{cert.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#f8f9f7] rounded-[40px] p-16 text-center border-2 border-dashed border-gray-200">
                    <h2 className="text-3xl font-black mb-3">
                      No Platform Certificates
                    </h2>
                    <p className="text-[#868685] text-lg font-semibold mb-8">
                      You haven't completed any courses yet.
                    </p>
                    <button className="bg-[#0e0f0c] text-[#9fe870] font-bold py-4 px-10 rounded-full hover:scale-105 transition-all">
                      Explore Courses
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={styles.card}>
                  {/* رأس القسم مع زر التعديل/الإلغاء */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-[900] text-[#0e0f0c] uppercase">
                        Security Settings
                      </h2>
                      <p className="text-gray-500 font-semibold mt-1">
                        Update your password to keep your account secure.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="font-bold text-[#054d28] underline whitespace-nowrap ml-4"
                    >
                      {isEditing ? "Cancel" : "Edit Password"}
                    </button>
                  </div>

                  <form
                    className="space-y-6 max-w-xl"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {/* Current Password */}
                    <div>
                      <label className={styles.label}>Current Password</label>
                      <input
                        type="password"
                        className={styles.input}
                        placeholder={
                          isEditing ? "Enter current password" : "••••••••"
                        }
                        value={passwordData.old_password}
                        disabled={!isEditing} // القفل هنا
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            old_password: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* New Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={styles.label}>New Password</label>
                        <input
                          type="password"
                          className={styles.input}
                          placeholder={
                            isEditing ? "Min. 8 characters" : "••••••••"
                          }
                          value={passwordData.new_password}
                          disabled={!isEditing} // القفل هنا
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              new_password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className={styles.label}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className={styles.input}
                          placeholder={
                            isEditing ? "Repeat new password" : "••••••••"
                          }
                          value={passwordData.confirm_password}
                          disabled={!isEditing} // القفل هنا
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirm_password: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* زر الحفظ يظهر فقط عند التعديل */}
                    {isEditing && (
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handlePasswordUpdate}
                          className={styles.btnPrimary}
                        >
                          Update Password
                        </button>
                        <div className="mt-12 pt-8 border-t border-gray-100">
                          <div className="flex items-center gap-4 justify-center p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                            <span className="text-2xl">⚠️</span>
                            <p className="text-sm text-yellow-800 font-semibold">
                              Make sure your new password is strong and contains
                              a mix of letters, numbers, and symbols.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// import React, { useState,  } from "react";
// // import { accountService } from "../../api/account.service";

// const ProfilePage = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState("details"); // 'details' or 'security'
//   const [certificates, _] = useState([]);

//   const styles = {
//     heading:
//       "text-[40px] md:text-[86px] font-[900] leading-[0.85] text-[#0e0f0c] tracking-tight mb-10",
//     card: "bg-white rounded-[30px] p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]",
//     input:
//       "w-full p-4 border border-[rgba(14,15,12,0.2)] rounded-[12px] focus:ring-1 focus:ring-inset focus:ring-[#9fe870] outline-none transition-all font-semibold",
//     btnPrimary:
//       "bg-[#9fe870] text-[#163300] font-bold py-4 px-10 rounded-full transition-transform hover:scale-[1.05] active:scale-[0.95] ",
//     btnTab: (active) =>
//       `pb-2 font-bold text-lg transition-all ${active ? "border-b-4 border-[#9fe870] text-[#0e0f0c]" : "text-gray-400"}`,
//   };

//   return (
//     <div className="min-h-screen bg-[#fcfdfb] p-6 md:p-12 font-['Inter']">
//       <div className="max-w-6xl mx-auto">
//         <h1 className={styles.heading}>
//           PROFILE
//           <br />
//           SETTINGS
//         </h1>
//         {/* التبويبات */}
//         <div className="flex gap-8 mb-10 overflow-x-auto pb-2">
//           {["details", "certificates", "security"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`text-xl font-black capitalize transition-all ${activeTab === tab ? "text-[#0e0f0c] border-b-4 border-[#9fe870] pb-2" : "text-gray-300"}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//         <div className="space-y-6">
//           <div className={`${styles.card} text-center`}>
//             <div className="relative w-40 h-40 mx-auto group">
//               <div className="w-full h-full rounded-full bg-[#e2f6d5] border-4 border-[#9fe870] flex items-center justify-center overflow-hidden">
//                 <span className="text-4xl">MK</span>{" "}
//               </div>
//               <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
//                 📷 <input type="file" className="hidden" accept="image/*" />
//               </label>
//             </div>
//             <h3 className="mt-4 font-black text-xl text-[#0e0f0c]">
//               Mohammed Kamal
//             </h3>
//             <p className="text-[#868685]">Software Developer</p>
//           </div>
//         </div>

//         {/* العمود الرئيسي: البيانات */}
//         <div className="lg:col-span-2">
//           {activeTab === "details" && (
//             <>
//               <div className={styles.card}>
//                 <div className="flex justify-between items-center mb-8">
//                   <h2 className="text-2xl font-black">Personal Info</h2>
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="font-bold text-[#054d28] underline"
//                   >
//                     {isEditing ? "Cancel" : "Edit Info"}
//                   </button>
//                 </div>

//                 <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="md:col-span-2">
//                     <label className="block mb-2 font-bold text-sm text-gray-500 uppercase">
//                       Full Name
//                     </label>
//                     <input
//                       className={styles.input}
//                       defaultValue="Mohammed Kamal Eldien"
//                       disabled={!isEditing}
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-2 font-bold text-sm text-gray-500 uppercase">
//                       Email Address
//                     </label>
//                     <input
//                       className={styles.input}
//                       defaultValue="m.kamal@example.com"
//                       disabled={!isEditing}
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-2 font-bold text-sm text-gray-500 uppercase">
//                       Phone Number
//                     </label>
//                     <input
//                       className={styles.input}
//                       defaultValue="+249..."
//                       disabled={!isEditing}
//                     />
//                   </div>

//                   {isEditing && (
//                     <div className="md:col-span-2 pt-4">
//                       <button type="button" className={styles.btnPrimary}>
//                         Update Profile
//                       </button>
//                     </div>
//                   )}
//                 </form>
//               </div>
//             </>
//           )}

//           {activeTab === "security" && (
//             <>
//               <div className={styles.card}>
//                 <h2 className="text-2xl font-black mb-8">Change Password</h2>
//                 <form className="space-y-6">
//                   <div>
//                     <label className="block mb-2 font-bold text-sm text-gray-500 uppercase">
//                       Current Password
//                     </label>
//                     <input
//                       type="password"
//                       className={styles.input}
//                       placeholder="••••••••"
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-2 font-bold text-sm text-gray-500 uppercase">
//                       New Password
//                     </label>
//                     <input
//                       type="password"
//                       className={styles.input}
//                       placeholder="Enter new password"
//                     />
//                   </div>
//                   <button type="button" className={styles.btnPrimary}>
//                     Save New Password
//                   </button>
//                 </form>
//               </div>
//             </>
//           )}

//           {activeTab === "certificates" && (
//             <div className="space-y-6">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-3xl font-black text-[#0e0f0c]">
//                   Your Certificates
//                 </h2>
//               </div>

//               {certificates.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {certificates.map((cert, index) => (
//                     <div key={index} className={styles.card}>
//                       <h3 className="text-xl font-bold">{cert.title}</h3>
//                       <p className="text-gray-500">{cert.issuer}</p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className={styles.emptyState}>
//                   <div className="text-6xl mb-4">📜</div>
//                   {/* <h3 className="text-2xl font-bold text-[#0e0f0c] mb-2">
//                       No certificates yet
//                     </h3>
//                     <p className="text-[#868685] text-center max-w-sm mb-6">
//                       You haven't achive any professional achievements. Start
//                       building your portfolio now!
//                     </p>
//                     <button className={`${styles.btnPrimary} `} >
//                       see all Events
//                     </button> */}
//                   <div className={styles.emptyState}>
//                     {/* <div className="text-7xl mb-6">🎓</div> */}
//                     <h2 className="text-3xl font-[900] text-[#0e0f0c] mb-3">
//                       No Platform Certificates
//                     </h2>
//                     <p className="text-[#868685] text-lg max-w-md font-semibold mb-8">
//                       You haven't completed any courses or tracks yet. Complete
//                       your first milestone to see your certificates here!
//                     </p>
//                     <button className="bg-[#0e0f0c] text-[#9fe870] font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform">
//                       Explore Courses
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
