import { ArrowRight, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import ThemeToggle from "../components/ThemeToggle";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ImageCropper from "../components/modals/ImageCropper";

function Signup() {
  const { t } = useTranslation();
  const fileInputRef = useRef();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [coppingImage, setCroppingImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { signup, isLogging } = useAuthStore();

  const formInputs = [
    {
      name: "fullName",
      type: "text",
      placeholder: t("signUpFullNamePlaceholder"),
      label: t("signUpFullNameLabel"),
      required: true,
      handleChange: (e) => {
        setFormData({ ...formData, fullName: e.target.value });
      },
    },
    {
      name: "username",
      type: "text",
      placeholder: t("signUpUsernamePlaceholder"),
      label: t("signUpUsernameLabel"),
      required: true,
      handleChange: (e) => {
        setFormData({ ...formData, username: e.target.value });
      },
    },
    {
      name: "Email",
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

  const handleImageImport = (e) => {
    const image = e.target.files[0];
    if (image) setCroppingImage(URL.createObjectURL(image));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.profilePic) {
      data.append("profilePic", formData.profilePic);
    }
    signup(data);
  };

  const handleImageCrop = ({ croppedImageUrl, file }) => {
    setPreview(croppedImageUrl);
    setCroppingImage(null);
    setFormData({ ...formData, profilePic: file });
  };

  const handleImageCropCancel = () => {
    setCroppingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <>
      <div className="bg-secondary min-h-[100vh] py-10 flex justify-center items-center dir-transition">
        <div className="flex w-[70vw] justify-center items-center gap-5">
          {/* Illustration */}
          <div className="hidden lg:block basis-1/2">
            <img src="./signup-illustration.svg" className="w-full" />
          </div>
          {/* Sing Up Form */}
          <div className="relative w-full lg:basis-1/2 bg-secondary-light shadow-lg p-5 rounded-md">
            <div className="absolute top-5 end-5 flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Link to="/" className="rtl:rotate-180">
                <ArrowRight size={24} />
              </Link>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
              <div className="flex flex-col items-center w-full">
                <label
                  htmlFor="profilePic"
                  className="flex justify-center items-center justify-self-center w-24 h-24 bg-secondary-dark rounded-full cursor-pointer overflow-hidden"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <Camera />
                  )}
                </label>
                <h3 className="font-medium">{t("signUpFullNameProfilePic")}</h3>
              </div>
              <input
                type="file"
                className="hidden"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageImport}
              />

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
                      required
                      onChange={input.handleChange}
                    />
                  </div>
                );
              })}
              <button className="btn btn-primary">
                {isLogging ? "..." : t("signUp")}
              </button>
              <div className="flex justify-center items-center gap-5 text-center">
                <span className="h-0.25 bg-text-light w-1/3"></span>
                <span className="text-sm">{t("haveAccount")}</span>
                <span className="h-0.25 bg-text-light w-1/3"></span>
              </div>
              <Link to="/login">
                <button className="btn btn-secondary w-full">
                  {t("login")}
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
      {/* Cropper */}
      {coppingImage && (
        <ImageCropper
          image={coppingImage}
          onCropDone={handleImageCrop}
          onCancel={handleImageCropCancel}
        />
      )}
    </>
  );
}

export default Signup;
