import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      "home": "Home",
      "about_us": "About Us",
      "features": "Features",
      "pricing": "Pricing",
      "login_signup": "Login / Sign Up",
      "welcome": "Welcome to HRSync",
      "logout": "Logout",
      "dashboard": "Dashboard",
      "directory": "Directory",
      "attendance": "Attendance",
      "leave": "Leave",
      "payroll": "Payroll",
      "assistant": "HRSync Assistant"
    }
  },
  hi: {
    translation: {
      "home": "होम",
      "about_us": "हमारे बारे में",
      "features": "विशेषताएं",
      "pricing": "मूल्य निर्धारण",
      "login_signup": "लॉग इन / साइन अप",
      "welcome": "HRSync में आपका स्वागत है",
      "logout": "लॉग आउट",
      "dashboard": "डैशबोर्ड",
      "directory": "निर्देशिका",
      "attendance": "उपस्थिति",
      "leave": "छुट्टी",
      "payroll": "पेरोल",
      "assistant": "HRSync सहायक"
    }
  },
  bn: {
    translation: {
      "home": "হোম",
      "about_us": "আমাদের সম্পর্কে",
      "features": "বৈশিষ্ট্য",
      "pricing": "মূল্য নির্ধারণ",
      "login_signup": "লগইন / সাইন আপ",
      "welcome": "HRSync এ স্বাগতম",
      "logout": "লগআউট",
      "dashboard": "ড্যাশবোর্ড",
      "directory": "ডিরেক্টরি",
      "attendance": "উপস্থিতি",
      "leave": "ছুটি",
      "payroll": "পে-রোল",
      "assistant": "HRSync সহকারী"
    }
  },
  mr: {
    translation: {
      "home": "मुख्यपृष्ठ",
      "about_us": "आमच्याबद्दल",
      "features": "वैशिष्ट्ये",
      "pricing": "किंमत",
      "login_signup": "लॉग इन / साइन अप",
      "welcome": "HRSync मध्ये आपले स्वागत आहे",
      "logout": "लॉगआउट",
      "dashboard": "डॅशबोर्ड",
      "directory": "निर्देशिका",
      "attendance": "उपस्थिती",
      "leave": "रजा",
      "payroll": "पेरोल",
      "assistant": "HRSync सहाय्यक"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
