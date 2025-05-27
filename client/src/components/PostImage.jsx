import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function PostImage({ url, maxHeight = 350 }) {
  const imageRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const checkImageHeight = () => {
    if (imageRef.current) {
      const naturalHeight = imageRef.current.naturalHeight;
      const clientWidth = imageRef.current.clientWidth;
      const expectedHeight =
        (naturalHeight / imageRef.current.naturalWidth) * clientWidth;

      setIsOverflowing(expectedHeight > maxHeight);
    }
  };

  useEffect(() => {
    const image = imageRef.current;

    const handleLoad = () => checkImageHeight();
    const handleResize = () => checkImageHeight();

    if (image && image.complete) {
      checkImageHeight();
    } else {
      image?.addEventListener("load", handleLoad);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      image?.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxHeight]);

  return (
    <figure
      className="relative overflow-hidden rounded-sm transition-all"
      style={{ maxHeight: showFull ? "none" : maxHeight }}
    >
      <img
        className="object-cover w-full cursor-pointer"
        src={url || ""}
        alt=""
        ref={imageRef}
      />
      {isOverflowing && (
        <div
          onClick={() => setShowFull(!showFull)}
          className={`absolute h-4/12 pb-2 bottom-0 left-1/2 -translate-x-1/2 w-full flex items-end justify-center cursor-pointer transition-all duration-300
            ${
              showFull
                ? "bg-transparent"
                : "bg-gradient-to-b from-transparent via-black/50 to-black"
            }`}
        >
          <button className="btn p-0">
            <ChevronDown
              className={`transition-transform text-white hover:text-primary ${
                showFull ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
      )}
    </figure>
  );
}

export default PostImage;
