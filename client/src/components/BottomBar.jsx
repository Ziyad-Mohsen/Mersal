import { House, Search, Sparkle, User, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function BottomBar() {
  const { t } = useTranslation();
  const { authUser } = useAuthStore();
  const location = useLocation();
  const navLinks = [
    {
      icon: <House size={26} />,
      text: t("home"),
      route: "/",
    },
    {
      icon: <Sparkle size={26} />,
      text: t("popular"),
      route: "/popular",
    },
    {
      icon: <Search />,
      text: t("search"),
      route: "/search",
    },
    {
      icon: authUser?.profilePic.url ? (
        <div className="flex items-center justify-center overflow-hidden w-6 h-6 rounded-full">
          <img src={authUser.profilePic.url} className="object-cover" />
        </div>
      ) : (
        <User />
      ),
      text: t("profile"),
      route: "/profile",
    },
  ];
  return (
    <div className="md:hidden fixed bottom-0 start-0 w-full bg-secondary-light shadow">
      <div className="container">
        <ul className="flex justify-center">
          {navLinks.map((link, i) => {
            return (
              <li key={i}>
                <Link
                  to={link.route}
                  className={`flex flex-col py-2 px-4 h-17 items-center justify-between cursor-pointer hover:bg-primary-dark hover:text-secondary transition-colors ${
                    location.pathname === link.route
                      ? "bg-primary text-secondary"
                      : ""
                  }`}
                >
                  <div>{link.icon}</div>
                  <h2>{link.text}</h2>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default BottomBar;
