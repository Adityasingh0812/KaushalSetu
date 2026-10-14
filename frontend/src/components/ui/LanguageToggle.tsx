import { useState } from "react";

export const LanguageToggle = () => {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-navy-600 bg-navy-50 rounded-md hover:bg-navy-100"
    >
      {language === "en" ? "EN" : "हिंदी"}
      <span className="ml-1 text-xs">▼</span>
    </button>
  );
};
