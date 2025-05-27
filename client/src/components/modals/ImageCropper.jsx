import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../lib/utils"; // path to your helper
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

function ImageCropper({ image, onCropDone, onCancel }) {
  const { t } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const { croppedImageUrl, file } = await getCroppedImg(
        image,
        croppedAreaPixels
      );
      if (onCropDone) {
        onCropDone({ croppedImageUrl, file });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    try {
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-51 flex items-center justify-center bg-black/50">
      <div className="flex flex-col w-full bg-secondary p-5 shadow-2xl">
        {/* Image */}
        <div className="relative w-full h-120 bg-gray-200">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            maxZoom={4}
            zoomSpeed={0.2}
            aspect={1}
            cropSize={{ width: 250, height: 250 }}
            showGrid={showGrid}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName:
                "bg-secondary-light border-secondary-dark border-5",
              cropAreaClassName: "rounded-full",
            }}
          />
        </div>

        {/* Settings */}
        <div className="flex justify-between items-center gap-5 mb-5">
          <div className="flex-1">
            <label htmlFor="zoom-radio" className="text-lg font-bold">
              {t("imageCropperZoom")}
            </label>
            <input
              id="zoom-radio"
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              className="w-full h-2 bg-secondary-dark rounded-lg appearance-none cursor-pointer accent-primary"
              onChange={(e) => setZoom(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg text-text">{t("imageCropperGrid")}</span>
            <button
              className={`w-6 h-6 border-2 cursor-pointer border-primary-dark hover:bg-primary-dark transition rounded-2xl ${
                showGrid ? "bg-primary" : "bg-transparent"
              }`}
              onClick={() => setShowGrid(!showGrid)}
            ></button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={handleCrop} className="btn btn-primary">
            {t("imageCropperConfirm")}
          </button>
          <button onClick={handleCancel} className="btn btn-secondary">
            {t("imageCropperCancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
