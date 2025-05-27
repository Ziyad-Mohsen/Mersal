import { useTranslation } from "react-i18next";
import useModal from "../../hooks/useModal";

function DeletePost({ onConfirm }) {
  const { t } = useTranslation();
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <div>
      <h5 className="mb-5 text-lg font-bold">{t("deletePostConfirm")}</h5>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => closeModal()}
          className="btn border-red-500 border-2 text-red-500 hover:bg-red-100 transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          className="btn bg-red-500 text-white hover:bg-red-700 transition-colors"
          onClick={handleConfirm}
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}

export default DeletePost;
