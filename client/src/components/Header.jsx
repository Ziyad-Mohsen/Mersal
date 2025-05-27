import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageToggle from "./languageToggle";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Radio, Settings, User } from "lucide-react";
import { useState } from "react";
import UserCardSkeleton from "./skeletons/UserCardSkeleton";
import Avatar from "./ui/Avatar";

function Header() {
  const { t } = useTranslation();
  const { authUser, isCheckingAuth, logout } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogOut = () => {
    logout();
  };

  return (
    <header className="w-full sticky top-0 left-0 shadow shadow-text/10 backdrop-blur-lg bg-secondary-light/98 z-20">
      <div className="container flex justify-between items-center mb-5 py-4 gap-2 rtl:flex-row-reverse">
        <div className="flex items-center rtl:flex-row-reverse gap-4 relative">
          <Link
            to="/"
            className="text-text flex items-center gap-2 text-2xl font-bold rtl:flex-row-reverse"
          >
            <img className="h-10" src="./logo.png" />
            {/* <Radio size={50} className="text-primary" /> */}
            <h1>{t("appName")}</h1>
          </Link>
          <button
            className={`cursor-pointer transition-transform ${
              showSettings ? "rotate-180" : "rotate-0"
            }`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={24} />
          </button>
          <div
            className={`absolute top-[110%] right-0 bg-secondary p-5 gap-2${
              showSettings ? "opacity-100 flex" : "opacity-0 hidden"
            } items-center rounded-b-lg rtl:flex-row-reverse transition-all`}
          >
            <span className="absolute border-b-secondary border-transparent border-12 -top-5 right-0"></span>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
        {isCheckingAuth ? (
          <UserCardSkeleton />
        ) : authUser ? (
          // When logged in
          <div className="flex items-center rtl:flex-row-reverse">
            <button
              className="btn hover:text-red-500 transition-colors"
              onClick={handleLogOut}
              title={t("logout")}
            >
              <LogOut />
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-2 rtl:flex-row-reverse"
            >
              <div className="flex flex-col gap-0">
                <div className="text-text-light font-semibold md:text-md lg:text-lg">
                  {authUser.fullName}
                </div>
              </div>
              <Avatar src={authUser.profilePic.url} size={48} />
            </Link>
          </div>
        ) : (
          // When logged out
          <div className="flex items-center rtl:flex-row-reverse gap-2">
            <Link to="/login">
              <button className="btn btn-primary">{t("login")}</button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-secondary">{t("signUp")}</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
