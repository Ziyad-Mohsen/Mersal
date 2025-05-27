import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();

  const titles = {
    en: "Mersal",
    ar: "مرسال",
  };

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.language);
    document.title = titles[i18n.language] || "Mersal";
  }, [i18n.language]);

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      className="p-1 font-semibold rounded-xl text-text  cursor-pointer hover:text-primary transition-colors selection:border-none"
      onClick={handleLanguageChange}
    >
      {i18n.language === "ar" ? "en" : "ar"}
    </button>
  );
}

export default LanguageToggle;
