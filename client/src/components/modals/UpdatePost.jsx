import { useState, useRef } from "react";
import { X, Trash2, ImagePlus, RotateCw } from "lucide-react";
import useModal from "../../hooks/useModal";
import { areEqualObjects } from "../../lib/utils";
import { useTranslation } from "react-i18next";

const UpdatePost = ({ post, onSubmit }) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();

  const originalData = {
    content: post?.content || "",
    postImage: post?.postImage?.url || null,
  };

  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(originalData);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormData({ ...formData, postImage: file });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, postImage: null });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleReset = () => {
    setFormData(originalData);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    const updatedData = new FormData();
    updatedData.append("content", formData.content);
    updatedData.append("postImage", formData.postImage);

    const updated = await onSubmit(updatedData);
    if (updated) {
      closeModal();
    }
  };

  return (
    <div className="w-full bg-secondary text-text rounded-2xl shadow-xl relative">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-primary">
          {t("UpdatePostModalTitle")}
        </h2>
        <button
          className="text-text hover:text-primary transition-colors"
          onClick={closeModal}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {formData.postImage && (
          <div className="relative w-full h-60 rounded-lg overflow-hidden">
            <img
              src={preview ? preview : formData.postImage}
              alt="Selected"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
              title="Remove image"
            >
              <Trash2 size={18} />
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
            id="post-image-input"
          />
          <label
            htmlFor="post-image-input"
            className="inline-flex items-center gap-2 text-sm cursor-pointer text-primary hover:underline"
          >
            <ImagePlus size={18} />
            {formData.postImage ? t("Replace Image") : t("Add Image")}
          </label>
        </div>

        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full h-32 p-3 rounded-lg bg-secondary-dark text-text placeholder-text/50 outline-none"
          placeholder="Update your post..."
        />
      </div>

      <div className="px-5 py-4 border-t border-white/10 flex justify-between">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-sm text-text hover:text-primary transition-colors cursor-pointer"
        >
          <RotateCw size={16} />
          {t("Reset")}
        </button>
        {!areEqualObjects(formData, originalData) && (
          <button
            className="btn btn-primary font-medium text-sm transition"
            onClick={handleSubmit}
          >
            {t("Save Changes")}
          </button>
        )}
      </div>
    </div>
  );
};

export default UpdatePost;
