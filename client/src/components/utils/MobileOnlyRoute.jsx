import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const MobileOnlyRoute = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? children : <Navigate to="/" replace />;
};

export default MobileOnlyRoute;
