import React from "react";
import { useNotifications } from "../../../hooks/useProfile";
import SEA_loading from "../../../components/ui/SEA_loading";
import { useLanguage } from "../../../context/LanguageContext";
import { S } from "../../../styles/profileStyles";

export default function NotificationsPanel() {
  const { translations, language } = useLanguage();
  const t = translations.profile;

  const {
    notifications,
    loading,
    error,
    page,
    setPage,
    totalPages,
    markingRead,
    markAllAsRead,
    markOneAsRead,
    deleteNotification,
    refresh
  } = useNotifications();

  const isRtl = language === "ar";

  const typeColors = {
    basic: "bg-blue-50 text-blue-600",
    warning: "bg-yellow-50 text-yellow-600",
    success: "bg-green-50 text-green-600",
    error: "bg-red-50 text-red-500",
  };

  return (
    <div
      className={`${S.card} ${isRtl ? "text-right" : "text-left"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center flex-col mb-6">
        <div>
          <h2 className="text-xl font-black text-[#0e0f0c] uppercase italic">
            {t.Notifications}
          </h2>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5"></p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingRead || loading}
            className="text-xs font-bold text-[#0d6efd] border border-[#0d6efd]/30 px-2 py-2 rounded-lg hover:bg-[#0d6efd]/5 transition-colors disabled:opacity-40"
          >
            {markingRead ? t.Marking : t.MarkAllAsRead}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center">
          <SEA_loading />
        </div>
      ) : error ? (
        <div className="py-10 text-center text-red-500 font-bold text-sm">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center text-gray-300 font-black text-lg uppercase">
          {t.Nonotifications}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                notif.is_read
                  ? "border-gray-100 bg-gray-50/50"
                  : "border-[#0d6efd]/20 bg-[#0d6efd]/3"
              }`}
            >
              {/* Dot */}
              <div className="mt-1.5 shrink-0">
                <div
                  className={`w-2 h-2 rounded-full ${
                    notif.is_read ? "bg-gray-200" : "bg-[#0d6efd]"
                  }`}
                />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      typeColors[notif.type] || typeColors.basic
                    }`}
                  >
                    {t[notif.type] || notif.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {new Date(notif.created_at).toLocaleDateString(
                      language === "ar" ? "ar-EG" : "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </span>
                </div>

                <p className="font-black text-sm text-[#0e0f0c]">
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  {notif.message}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2">
                  {!notif.is_read && (
                    <button
                      onClick={() => {
                        markOneAsRead(notif.id);
                        refresh();
                      }}
                      className="text-[10px] font-bold text-[#0d6efd] hover:underline"
                    >
                      {t.MarkAsRead}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteNotification(notif.id);
                      refresh();
                    }}
                    className="text-[10px] font-bold text-red-400 hover:underline"
                  >
                    {t.Delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:border-[#0d6efd] hover:text-[#0d6efd] disabled:opacity-30 transition-all"
          >
            {isRtl ? "→" : "←"} {t.Prev}
          </button>

          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {t.Page} {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:border-[#0d6efd] hover:text-[#0d6efd] disabled:opacity-30 transition-all"
          >
            {t.Next} {isRtl ? "←" : "→"}
          </button>
        </div>
      )}
    </div>
  );
}