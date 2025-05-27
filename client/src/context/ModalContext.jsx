import { createContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const { pathname } = useLocation();
  const [modalContent, setModalContent] = useState(null);
  const modalRef = useRef();

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  // Close modal when route changes
  useEffect(() => {
    closeModal();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            className="flex flex-col w-10/12 md:w-2/4 bg-secondary p-5 shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
