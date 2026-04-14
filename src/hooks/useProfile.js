import { useState, useEffect } from "react";
import { accountService } from "../api/account.service";

export const useProfile = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: 0,
    uni_id: 0,
    name_ar: "محمد كمال الدين",
    name_en: "mohammed kamal ",
    phone: "+00971...",
    department: "Computer",
    gender: "Mail",
    email: "Test@gmail.org", // مضاف للعرض فقط
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await accountService.updatePassword(passwordData);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      alert("Password updated successfully!");
    } catch (err) {
      alert("Error updating password. Please check your old password.");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, certRes] = await Promise.all([
          accountService.getProfile(),
          accountService.getCertificates(),
        ]);
        setUserData(profileRes.data);
        setCertificates(certRes.data || []);
      } catch (err) {
        console.error("Error fetching account data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      await accountService.updateProfile(userData);
      setIsEditing(false);
      alert("تم تحديث البيانات بنجاح");
    } catch (err) {
      alert("فشل التحديث، تأكد من صحة البيانات");
      console.log(err);
    }
  };

  const handlePictureUpdate = async (file) => {
    const formData = new FormData();
    formData.append("picture", file);
    try {
      await accountService.updateProfilePicture(formData);
      alert("تم تحديث الصورة");
      // يفضل إعادة جلب البيانات هنا لتحديث الصورة في الواجهة
    } catch (err) {
      alert("فشل تحديث الصورة");
      console.log(err);
    }
  };

  return {
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
  };
};
