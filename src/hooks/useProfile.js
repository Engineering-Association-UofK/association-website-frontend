import { useState, useEffect } from "react";
import { accountService } from "../api/account.service";

export const useProfile = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: 0,
    uni_id: 0,
    name_ar: "",
    name_en: "",
    phone: ".",
    department: "",
    gender: "",
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

  // src/hooks/useProfile.js

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // طلب بيانات البروفايل
        const profileRes = await accountService.getProfile();
        if (profileRes?.data) {
          setUserData(profileRes.data);
        }

        try {
          const certRes = await accountService.getCertificates({
            page: 1,
            limit: 10,
          });
          setCertificates(certRes.data || []);
        } catch (certErr) {
          console.error("Certificates fetch failed", certErr);
          setCertificates([]); // نضمن إنها مصفوفة فاضية مش undefined
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
        // هنا المراجع طلب إننا نعرض Error بدل القيم الافتراضية
        setUserData(null);
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
};;
