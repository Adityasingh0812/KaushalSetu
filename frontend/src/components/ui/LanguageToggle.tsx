import { useLanguage } from "../../contexts/LanguageContext";

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-navy-600 bg-navy-50 rounded-md hover:bg-navy-100"
    >
      {language === "en" ? t("language.english") : t("language.hindi")}
      <span className="ml-1 text-xs">▼</span>
    </button>
  );
};
