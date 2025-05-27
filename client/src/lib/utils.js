export function dateFormate(isoDate) {
  const postDate = new Date(isoDate);
  const now = new Date();

  const diffInMs = now - postDate; // Difference in milliseconds
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let timeAgo = "";

  if (diffInSeconds < 60) {
    timeAgo = `${diffInSeconds}s`;
  } else if (diffInMinutes < 60) {
    timeAgo = `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    timeAgo = `${diffInHours}h`;
  } else {
    timeAgo = `${diffInDays}d`;
  }

  return timeAgo;
}

export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }

          // Create a File object from the Blob
          const file = new File([blob], "cropped-image.jpeg", {
            type: "image/png",
            lastModified: Date.now(),
          });

          const croppedImageUrl = URL.createObjectURL(file);

          resolve({ file, croppedImageUrl }); // <--- return the File and the preview URL
        },
        "image/jpeg",
        1
      );
    };
    image.onerror = (error) => reject(error);
  });
};

export const areEqualObjects = (object1, object2) => {
  if (object1 === object2) return true;

  if (
    typeof object1 !== "object" ||
    typeof object2 !== "object" ||
    object1 === null ||
    object2 === null
  )
    return false;

  const keysA = Object.keys(object1);
  const keysB = Object.keys(object2);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!areEqualObjects(object1[key], object2[key])) return false;
  }

  return true;
};
