import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/languageToggle";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function LoginPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLogging } = useAuthStore();
  const formInputs = [
    {
      name: "email",
      type: "email",
      placeholder: t("signUpEmailPlaceholder"),
      label: t("signUpEmailLabel"),
      required: true,
      handleChange: (e) => {
        setFormData({ ...formData, email: e.target.value });
      },
    },
    {
      name: "password",
      type: "password",
      placeholder: t("signUpPasswordPlaceholder"),
      label: t("signUpPasswordLabel"),
      required: true,
      handleChange: (e) => {
        setFormData({ ...formData, password: e.target.value });
      },
    },
  ];

  const handleLogin = (event) => {
    event.preventDefault();
    login(formData);
  };

  return (
    <div className="bg-secondary h-[100vh] flex justify-center items-center">
      <div className="flex w-[70vw] justify-center items-center gap-5">
        {/* Illustration */}
        <div className="hidden lg:block basis-1/2">
          <img src="./signup-illustration.svg" className="w-full" />
        </div>
        {/* Sing Up Form */}
        <div className="relative w-full lg:basis-1/2 bg-secondary-light shadow-lg p-5 rounded-md pt-10">
          <div className="absolute top-5 end-5 flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link to="/" className="rtl:rotate-180">
              <ArrowRight size={24} />
            </Link>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            {formInputs.map((input, i) => {
              return (
                <div key={i} className="flex flex-col gap-2">
                  <label htmlFor={input.name}>{input.label}</label>
                  <input
                    type={input.type}
                    id={input.name}
                    name={input.name}
                    placeholder={input.placeholder}
                    className="bg-secondary-dark p-2 font-semibold focus:outline-primary"
                    required={input.required}
                    value={formData[input.name]}
                    onChange={input.handleChange}
                  />
                </div>
              );
            })}
            <button className="btn btn-primary">
              {isLogging ? "..." : t("login")}
            </button>
            <div className="flex justify-center items-center gap-5">
              <span className="h-0.25 bg-text-light w-1/3"></span>
              <span className="text-sm text-center">{t("noAccount")}</span>
              <span className="h-0.25 bg-text-light w-1/3"></span>
            </div>
            <Link to="/signup">
              <button className="btn btn-secondary w-full">
                {t("signUp")}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
