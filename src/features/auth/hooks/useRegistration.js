import { useState, useCallback } from 'react';
import { authService } from '../api/auth.service';
import { useLanguage } from '../../../context/LanguageContext';

export const useRegistration = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);

  const clearError = () => setError(null);

  // Check state step via registration code
  const checkState = useCallback(async (regCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.checkRegistration(regCode);
      const step = response?.reg_step;
      setCurrentStep(step);
      return step;
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to verify registration code.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Step 0: Initial Registration
  const submitInitial = async ({ userId, passcode, email }) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user_id: Number(userId),
        passcode,
        email,
        lang: language || 'en',
      };
      const res = await authService.doRegistrationStep(0, payload);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || 'Initial registration failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 1 & Step 5: Password Credentials
  const submitPassword = async (regCode, stepNumber, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        reg_code: regCode,
        password,
        confirm_password: confirmPassword,
      };
      const res = await authService.doRegistrationStep(stepNumber, payload);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || 'Password submission failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Student Details
  const submitDetails = async (regCode, detailsData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        reg_code: regCode,
        name_ar: detailsData.nameAr,
        name_en: detailsData.nameEn,
        gender: detailsData.gender,
        uni_id: String(detailsData.uniId),
        department: detailsData.department,
        phone: detailsData.phone || '',
      };
      const res = await authService.doRegistrationStep(2, payload);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || 'Details submission failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Username Setup
  const submitUsername = async (regCode, username) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        reg_code: regCode,
        username,
      };
      const res = await authService.doRegistrationStep(3, payload);
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || 'Username registration failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    currentStep,
    clearError,
    checkState,
    submitInitial,
    submitPassword,
    submitDetails,
    submitUsername,
  };
};