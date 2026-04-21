import apiClient from "./axiosClient"; // استيراد العميل الذي قمت بإنشائه مسبقاً

const ENDPOINT = "v1/admin/event";

export const eventService = {
  /**
   * جلب جميع الفعاليات (GET /admin/event)
   * @param {number} page - رقم الصفحة
   * @param {number} limit - عدد العناصر في الصفحة
   */
  getAll: async (page = 1, limit = 10) => {
    return await apiClient.get(`${ENDPOINT}`, {
      params: { page, limit }, // إرسال المعايير كـ Query Parameters
    });
  },

  /**
   * جلب تفاصيل فعالية محددة (GET /admin/event/{id})
   */
  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * إنشاء فعالية جديدة (POST /admin/event)
   * نرسل البيانات (Object) كما هو مطلوب في Swagger
   */
  create: async (eventData) => {
    return await apiClient.post(ENDPOINT, eventData);
  },

  /**
   * تحديث فعالية موجودة (PUT /admin/event)
   */
  update: async (eventData) => {
    return await apiClient.put(ENDPOINT, eventData);
  },

  /**
   * حذف فعالية (DELETE /admin/event/{id})
   */
  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  /**
   * استيراد مستخدمين من ملف Excel (POST /admin/event/import-users/{id})
   */
  importUsers: async (id, file) => {
    const formData = new FormData();
    formData.append("file", file); // رفع الملف كـ FormData
    return await apiClient.post(`${ENDPOINT}/import-users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
