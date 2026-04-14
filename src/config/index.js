export const CONFIG = {
    API_BASE_URL: (import.meta.env.VITE_API_BASE_URL_RAW || 'http://localhost:8080')+'/api',
    API_NEW_BASE_URL: (import.meta.env.VITE_API_NEW_BASE_URL_RAW || 'http://localhost:8000')+'/api',
    API_BASE_URL_RAW: import.meta.env.VITE_API_BASE_URL_RAW || 'http://localhost:8080',
    API_MONITOR_URL: import.meta.env.VITE_API_MONITOR_URL || 'http://localhost:8888',
    // ADMIN_ROLES: ["sys:admin", "sys:super_admin", "sys:user_manager", "sys:tech_support", "content:editor", "content:blog_manager", "content:event_manager", "content:form_manager", "cert:certifier", "cert:manager", "cert:viewer"],
  TIMEOUT: 10000,
};