import { User } from "lucide-react";

function Avatar({ src, size = 112, alt = "avatar", onClick }) {
  return (
    <div
      className="flex items-center justify-center rounded-full overflow-hidden bg-secondary cursor-pointer"
      style={{ width: size, height: size }}
      onClick={onClick ? onClick : null}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User size={size / 2} className="text-text" />
      )}
    </div>
  );
}

export default Avatar;
