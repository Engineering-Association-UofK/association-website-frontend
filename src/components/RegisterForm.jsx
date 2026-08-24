import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext.jsx";
import { DEPARTMENTS } from '../utils/departments';


// const DEPARTMENTS = [
//   { value: "surveying", label: "Surveying Engineering" },
//   { value: "agricultural", label: "Agricultural Engineering" },
//   { value: "civil", label: "Civil Engineering" },
//   { value: "electrical", label: "Electrical and Electronics Engineering" },
//   { value: "mechanical", label: "Mechanical Engineering" },
//   { value: "mining", label: "Mining Engineering" },
//   { value: "chemical", label: "Chemical Engineering" },
//   { value: "petroleum", label: "Petroleum Engineering" },
// ];

const INITIAL_FORM = {
  user_id: "",
  uni_id: "",
  username: "",
  name_en: "",
  name_ar: "",
  email: "",
  phone: "",
  passcode: "",
  password: "",
  confirm_password: "",
  gender: "",
  department: "",
};

const RegisterForm = () => {
  const { translations, language } = useLanguage();
  // console.log(language);
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [step, setStep] = useState(1); // التحكم في المراحل
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError(
        language === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match",
      );
      return;
    }

    const result = await register({
      user_id: Number(formData.user_id),
      uni_id: formData.uni_id,
      username: formData.username,
      name_en: formData.name_en,
      name_ar: formData.name_ar,
      email: formData.email,
      phone: formData.phone,
      passcode: formData.passcode,
      password: formData.password,
      confirm_password: formData.confirm_password,
      gender: formData.gender,
      department: formData.department,
    });

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  const t = translations.register

  const inputStyles =
    "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0b5ed7] focus:border-transparent outline-none transition-all bg-gray-50/50";
  const labelStyles =
    "block mb-1.5 text-sm font-bold text-gray-700 uppercase tracking-wider";

  return (
    <div className="min-h-screen flex items-center justify-center p-2 ">
      <div className="max-w-2xl w-full bg-white rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div
            className={`h-2 w-20 rounded-full ${step >= 1 ? "bg-[#22B2E6]" : "bg-gray-100"}`}
          ></div>
          <div
            className={`h-2 w-20 rounded-full ${step >= 2 ? "bg-[#22B2E6]" : "bg-gray-100"}`}
          ></div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#0e0f0c] uppercase tracking-tight">
            {t.title}
          </h2>
          <p className="text-gray-500 font-medium mt-2">
            {step === 1
              ? "University Credentials"
              : "Personal & Account Details"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-semibold text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={
            step === 2
              ? handleSubmit
              : (e) => {
                  e.preventDefault();
                  nextStep();
                }
          }
        >
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>{t.studentIndex}</label>
                  <input
                    type="number"
                    name="user_id"
                    required
                    className={inputStyles}
                    placeholder="e.g. 123456"
                    value={formData.user_id}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={labelStyles}>{t.uniId}</label>
                  <input
                    type="number"
                    name="uni_id"
                    required
                    className={inputStyles}
                    placeholder="e.g. 123456789"
                    value={formData.uni_id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className={labelStyles}>{t.passcode}</label>
                <input
                  type="text"
                  name="passcode"
                  required
                  className={inputStyles}
                  placeholder="Enter your passcode"
                  value={formData.passcode}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-400 mt-1">{t.passcodeHelp}</p>
              </div>
              <button
                type="submit"
                className="w-full bg-[#22B2E6] text-white font-black py-4  hover:scale-[1.02] transition-transform"
                style={{ borderRadius: "20px" }}
              >
                {language === "ar"
                  ? "الذهاب للتفاصيل الشخصية"
                  : "CONTINUE TO PERSONAL INFO"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>{t.nameEn}</label>
                  <input
                    type="text"
                    name="name_en"
                    required
                    className={inputStyles}
                    value={formData.name_en}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={labelStyles} dir="rtl">
                    {t.nameAr}
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    required
                    className={inputStyles}
                    dir="rtl"
                    value={formData.name_ar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>{t.gender}</label>
                  <select
                    name="gender"
                    required
                    className={inputStyles}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      {language === "ar" ? "اختر" : "Select"}
                    </option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>
                    {language === "ar" ? "اختر القسم" : "Select Dept"}
                  </label>
                  <select
                    name="department"
                    required
                    className={inputStyles}
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">
                      {language === "ar" ? "اختر القسم" : "Select Dept"}
                    </option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>{t.username}</label>
                  <input
                    type="text"
                    name="username"
                    required
                    className={inputStyles}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={t.username}
                  />
                </div>
                <div>
                  <label className={labelStyles}>{t.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={inputStyles}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0912345678"
                  />
                </div>
              </div>

              <div>
                <label className={labelStyles}>{t.email}</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={inputStyles}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailExample}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="password"
                  name="password"
                  placeholder={t.password}
                  required
                  className={inputStyles}
                  value={formData.password}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="confirm_password"
                  placeholder={translations.register.confirmPassword}
                  required
                  className={inputStyles}
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-full hover:bg-gray-200 transition-all"
                  style={{ borderRadius: "20px" }}
                >
                  {t.back}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 bg-[#22B2E6] text-white font-black py-4  hover:scale-[1.02] transition-transform disabled:opacity-50"
                  style={{ borderRadius: "20px" }}
                >
                  {loading
                    ? translations.register.loading
                    : language === "ar"
                      ? "إنشاء حساب"
                      : '"CREATE ACCOUNT"'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-8 font-semibold text-gray-500">
          {translations.register.haveAccount}
          <Link
            to="/login"
            className="text-[#054d28] underline underline-offset-4 decoration-2"
          >
            {translations.register.login}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;