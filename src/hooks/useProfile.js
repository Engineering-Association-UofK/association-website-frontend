import { useState, useEffect } from "react";
import apiClient from "../api/axiosClient";
import { useLanguage } from "../context/LanguageContext";

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
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || t.networkError;
      setStatus({ msg: errorMsg, type: "error" });
      setLoading(false);
      return false;
    }
  };

  const resetStatus = () => setStatus({ msg: "", type: "" });

  return { updatePassword, loading, status, resetStatus };
};

export const useUpdateProfilePicture = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const updatePicture = async (file) => {
    if (!file) return false;

    setLoading(true);
    setStatus({ msg: "", type: "" });

    const formData = new FormData();
    formData.append("picture", file);

    try {
      const response = await apiClient.put("/v1/account/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({
        msg: response.data?.message || "تم تحديث الصورة بنجاح",
        type: "success",
      });
      setLoading(false);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "فشل تحديث الصورة";
      setStatus({ msg: errorMsg, type: "error" });
      setLoading(false);
      return false;
    }
  };

  const resetStatus = () => setStatus({ msg: "", type: "" });

  return { updatePicture, loading, status, resetStatus };
};

export const useUpdateProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const updateProfile = async (profileData) => {
    setLoading(true);
    setStatus({ msg: "", type: "" });

    try {
      const response = await apiClient.put("/v1/account", profileData);
      setStatus({
        msg: response.data?.message || "تم تحديث البيانات بنجاح",
        type: "success",
      });
      setLoading(false);
      return true;
    } catch (err) {
      const serverResponse = err.response?.data;
      let fullErrorMessage = serverResponse?.message || "حدث خطأ أثناء التحديث";
      if (serverResponse?.errors) {
        const fieldErrors = Object.values(serverResponse.errors).join(", ");
        fullErrorMessage = `${serverResponse.message}: ${fieldErrors}`;
      }
      setStatus({ msg: fullErrorMessage, type: "error" });
      setLoading(false);
      return false;
    }
  };

  const resetStatus = () => setStatus({ msg: "", type: "" });

  return { updateProfile, loading, status, resetStatus };
};

export const useUpdateUsername = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  /**
   * @param {string} username - اسم المستخدم الجديد
   * @returns {boolean} true عند النجاح، false عند الفشل
   */
  const updateUsername = async (username) => {
    if (!username || !username.trim()) {
      setStatus({ msg: "اسم المستخدم لا يمكن أن يكون فارغاً", type: "error" });
      return false;
    }

    setLoading(true);
    setStatus({ msg: "", type: "" });

    try {
      const response = await apiClient.put("/v1/account/username", {
        username: username.trim(),
      });

      setStatus({
        msg: response.data?.message || "تم تحديث اسم المستخدم بنجاح",
        type: "success",
      });
      setLoading(false);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "فشل تحديث اسم المستخدم";
      setStatus({ msg: errorMsg, type: "error" });
      setLoading(false);
      return false;
    }
  };

  const resetStatus = () => setStatus({ msg: "", type: "" });

  return { updateUsername, loading, status, resetStatus };
};

export const useUpdateEmail = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  /**
   * @param {string} email -
   * @returns {boolean}
   */
  const updateEmail = async (email) => {
    if (!email || !email.trim()) {
      setStatus({
        msg: "البريد الإلكتروني لا يمكن أن يكون فارغاً",
        type: "error",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus({ msg: "صيغة البريد الإلكتروني غير صحيحة", type: "error" });
      return false;
    }

    setLoading(true);
    setStatus({ msg: "", type: "" });

    try {
      const response = await apiClient.put("/v1/account/email", {
        email: email.trim(),
      });

      setStatus({
        msg: response.data?.message || "تم تحديث البريد الإلكتروني بنجاح",
        type: "success",
      });
      setLoading(false);
      return true;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "فشل تحديث البريد الإلكتروني";
      setStatus({ msg: errorMsg, type: "error" });
      setLoading(false);
      return false;
    }
  };

  const resetStatus = () => setStatus({ msg: "", type: "" });

  return { updateEmail, loading, status, resetStatus };
};

export const useAccountSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/v1/account/summary");
      // Adjusting based on your API response structure (response.data vs response)
      setSummary(response.data || response);
      setError(null);
    } catch (err) {
      console.error("Summary Fetch Error:", err);
      setError(err.response?.data?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading, error, refreshSummary: fetchSummary };
};

// export const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [markingRead, setMarkingRead] = useState(false);
//   const LIMIT = 10;

//   const fetchNotifications = async (pageNum = 1) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get("/v1/account/notifications", {
//         params: { limit: LIMIT, page: pageNum },
//       });
//       const data = response.data || response;
//       setNotifications(data.notifications || []);
//       setTotalPages(data.pages || 1);
//       setTotal(data.total || 0);
//       setError(null);
//     } catch (err) {
//       console.error("Notifications Fetch Error:", err);
//       setError(err.response?.data?.message || "Network Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAllAsRead = async () => {
//     setMarkingRead(true);
//     try {
//       await apiClient.post("/v1/account/notifications");

//       setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
//     } catch (err) {
//       console.error("Mark as read Error:", err);
//     } finally {
//       setMarkingRead(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications(page);
//   }, [page]);

//   return {
//     notifications,
//     loading,
//     error,
//     page,
//     setPage,
//     totalPages,
//     total,
//     markingRead,
//     markAllAsRead,
//     refresh: () => fetchNotifications(page),
//   };

// }

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [markingRead, setMarkingRead] = useState(false);
  const LIMIT = 10;

  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await apiClient.get("/v1/account/notifications", {
        params: { limit: LIMIT, page: pageNum },
      });
      const data = response.data || response;
      setNotifications(data.notifications || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
      setError(null);
    } catch (err) {
      console.error("Notifications Fetch Error:", err);
      setError(err.response?.data?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setMarkingRead(true);
    try {
      await apiClient.post("/v1/account/notifications");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Mark as read Error:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await apiClient.get(`/v1/account/notifications/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error("Mark one as read Error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiClient.delete(`/v1/account/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Delete Notification Error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  return {
    notifications,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    markingRead,
    markAllAsRead,
    markOneAsRead,
    deleteNotification,
    refresh: () => fetchNotifications(page),
  };
};