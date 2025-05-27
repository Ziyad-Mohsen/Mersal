import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import ThemeToggle from "../components/ThemeToggle";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-5">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-text mb-6">{t("Page not found")}</p>
      <Link to="/" className="btn btn-primary">
        {t("Go to Home")}
      </Link>
      <div className="flex item-center gap-2 py-5 rtl:flex-row-reverse">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </div>
  );
};

export default NotFound;
