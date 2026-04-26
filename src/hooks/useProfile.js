// import apiClient from "../api/axiosClient";

// let profilePromise = null;
// let certificatesPromise = null;

// export const getProfileData = () => {
//   if (!profilePromise) {
//     profilePromise = apiClient
//       .get("/v1/account")
//       .then((res) => res)
//       .catch((err) => {
//         profilePromise = null;
//         throw err;
//       });
//   }
//   return profilePromise;
// };

// export const getCertificatesData = () => {
//   if (!certificatesPromise) {
//     certificatesPromise = apiClient
//       .get("/v1/account/certificates")
//       .then((res) => res)
//       .catch((err) => {
//         certificatesPromise = null;
//         throw err;
//       });
//   }
//   return certificatesPromise;
// };

import { useState, useEffect } from "react";
import apiClient from "../api/axiosClient";
import { useLanguage } from "../context/LanguageContext";



// 1. Hook الخاص ببيانات الملف الشخصي
export const useProfileData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/v1/account");
      setProfile(response.data || response);
      setError(null);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setError(err.response?.data?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refreshProfile: fetchProfile };
};

// 2. Hook الخاص بالشهادات
export const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/v1/account/certificates");
      setCertificates(response.data || response);
      setError(null);
    } catch (err) {
      console.error("Certificates Fetch Error:", err);
      setError("Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return {
    certificates,
    loading,
    error,
    refreshCertificates: fetchCertificates,
  };
};

export const useUpdatePassword = () => {

  
const { translations } = useLanguage();
const t = translations.profile.password;
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const updatePassword = async (passwordData) => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setStatus({ msg: t.passwordMismatch, type: "error" });
      return false;
    }

    setLoading(true);
    setStatus({ msg: "", type: "" });

    try {
      const response = await apiClient.put(
        "/v1/account/password",
        passwordData,
      );
      setStatus({
        msg: response.data?.message || t.updateSuccess,
        type: "success",
      });
      setLoading(false);
      return true; // نجاح
    } catch (err) {
      const errorMsg = err.response?.data?.message || t.networkError;
      setStatus({ msg: errorMsg, type: "error" });
      setLoading(false);
      return false; // فشل
    }
  };

  const resetStatus = () => setStatus({ msg: "", type: "" });

  return { updatePassword, loading, status, resetStatus };
};
