import { House, Search, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navLinks = [
    {
      icon: <House size={26} />,
      text: t("home"),
      route: "/",
    },
    {
      icon: <Search />,
      text: t("search"),
      route: "/search",
    },
    {
      icon: <User size={26} />,
      text: t("profile"),
      route: "/profile",
    },
  ];

  return (
    <>
      <div className="mb-5 text-gray-500 font-medium">{t("navbarTitle")}</div>
      <ul className="flex flex-col gap-2">
        {navLinks.map((link, i) => {
          return (
            <li key={i}>
              <Link
                to={link.route}
                className={`flex p-2 items-center justify-center cursor-pointer hover:bg-primary hover:text-secondary transition-colors ${
                  location.pathname === link.route
                    ? "bg-primary text-secondary"
                    : ""
                }`}
              >
                <div className="p-2 flex justify-center items-center">
                  {link.icon}
                </div>
                <h2 className="flex-1 text-lg font-medium hidden lg:block">
                  {link.text}
                </h2>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Navbar;
