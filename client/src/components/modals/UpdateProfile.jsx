import { useState, useRef } from "react";
import { X, Trash2, ImagePlus, RotateCw } from "lucide-react";
import useModal from "../../hooks/useModal";
import ImageCropper from "./ImageCropper";
import { areEqualObjects } from "../../lib/utils";
import Avatar from "../ui/Avatar";
import { useTranslation } from "react-i18next";

const UpdateProfile = ({ user, onSubmit }) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();

  const originalData = {
    profilePic: user?.profilePic?.url || null,
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
  };

  const [preview, setPreview] = useState(null);
  const [coppingImage, setCroppingImage] = useState(null);

  const [formData, setFormData] = useState(originalData);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCroppingImage(url);
    }
  };

  const handleImageCrop = ({ croppedImageUrl, file }) => {
    setPreview(croppedImageUrl);
    setFormData({ ...formData, profilePic: file });
    setCroppingImage(null); // Close image cropper
  };

  const handleImageCropCancel = () => {
    setCroppingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, profilePic: null });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleReset = () => {
    setFormData(originalData);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    const updatedData = new FormData();
    updatedData.append("fullName", formData.fullName);
    updatedData.append("username", formData.username);
    updatedData.append("email", formData.email);
    updatedData.append("profilePic", formData.profilePic);

    const updated = await onSubmit(updatedData);
    if (updated === 200) {
      closeModal();
    }
  };

  return (
    <>
      <div className="w-full bg-secondary text-text rounded-2xl shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-primary">
            {t("updateProfileModalTitle")}
          </h2>
          <button
            className="cursor-pointer text-text hover:text-primary transition-colors"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Profile Picture */}
          {formData.profilePic && (
            <div className="flex justify-center relative">
              <Avatar src={preview ? preview : formData.profilePic} />
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
                title={t("UpdateProfileModalRemoveImageButtonTitle")}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              id="profile-image-input"
            />
            <label
              htmlFor="profile-image-input"
              className="inline-flex items-center gap-2 text-sm cursor-pointer text-primary hover:underline"
            >
              <ImagePlus size={18} />
              {formData.profilePic
                ? t("UpdateProfileChangeImage")
                : t("UpdateProfileAddImage")}
            </label>
          </div>

          {/* Fields */}
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-secondary-dark text-text placeholder-text/50 outline-none"
            placeholder={t("signUpFullNameLabel")}
          />
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-secondary-dark text-text placeholder-text/50 outline-none"
            placeholder={t("signUpUsernameLabel")}
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-secondary-dark text-text placeholder-text/50 outline-none"
            placeholder={t("signUpEmailLabel")}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-sm text-text hover:text-primary transition-colors cursor-pointer"
          >
            <RotateCw size={16} />
            {t("UpdateProfileReset")}
          </button>
          {!areEqualObjects(formData, originalData) && (
            <button
              className="btn btn-primary font-medium text-sm transition"
              onClick={handleSubmit}
            >
              {t("UpdateProfileSaveChanges")}
            </button>
          )}
        </div>

        {/* Cropper */}
      </div>
      {coppingImage && (
        <ImageCropper
          image={coppingImage}
          onCropDone={handleImageCrop}
          onCancel={handleImageCropCancel}
        />
      )}
    </>
  );
};

export default UpdateProfile;
