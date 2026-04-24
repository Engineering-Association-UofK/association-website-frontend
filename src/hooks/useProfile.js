

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
