import React, { useState, Fragment } from "react";
import { useUpdatePassword } from "../../../hooks/useProfile";
import SEA_loading from "../../../components/ui/SEA_loading";
import { useLanguage } from "../../../context/LanguageContext";
import StatusMessage from "./StatusMessage";
import { S } from "../../../styles/profileStyles";

export default function PasswordSettings() {
  const { translations } = useLanguage();
  const t = translations.profile.password;

  const { updatePassword, loading, status, resetStatus } = useUpdatePassword();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await updatePassword(formData);
    if (isSuccess) {
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
      setTimeout(resetStatus, 3000);
    }
  };

  if (loading) {
    return (
      <Fragment>
        <SEA_loading />
      </Fragment>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className={S.card}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0e0f0c] italic uppercase">
              {t.securityTitle || "Security Settings"}
            </h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              Update your password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={S.label}>{t.oldPassword}</label>
            <input
              type="password"
              placeholder="••••••••"
              className={S.input}
              value={formData.old_password}
              onChange={(e) => {
                resetStatus();
                setFormData({ ...formData, old_password: e.target.value });
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={S.label}>{t.newPassword}</label>
              <input
                type="password"
                placeholder="••••••••"
                className={S.input}
                value={formData.new_password}
                onChange={(e) =>
                  setFormData({ ...formData, new_password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className={S.label}>{t.confirmPassword}</label>
              <input
                type="password"
                placeholder="••••••••"
                className={S.input}
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          <StatusMessage status={status} />

          <button type="submit" disabled={loading} className={S.btn}>
            {loading
              ? t.updatingBtn || "Updating..."
              : t.updateBtn || "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}