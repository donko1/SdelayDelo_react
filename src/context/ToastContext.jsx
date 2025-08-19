import { createContext, useContext, useState, useRef, useEffect } from "react";
import { Toast } from "@components/ui/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const savedCallbacks = useRef({ onClose: null, onUndo: null });
  const [isPaused, setIsPaused] = useState(false);

  const showToast = (message, type = "success", callbacks = {}) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    savedCallbacks.current = {
      onClose: callbacks.onClose || null,
      onUndo: callbacks.onUndo || null,
    };

    setToast({ message, type });
    setIsVisible(true);
    setIsPaused(false);
  };

  const handleClose = (shouldCallOnClose = true) => {
    setIsVisible(false);

    setTimeout(() => {
      if (shouldCallOnClose && savedCallbacks.current.onClose) {
        savedCallbacks.current.onClose();
      }
      setToast(null);
      savedCallbacks.current = { onClose: null, onUndo: null };
      setIsPaused(false);
    }, 300);
  };

  const handleUndo = () => {
    if (savedCallbacks.current.onUndo) savedCallbacks.current.onUndo();
    handleClose(false);
  };

  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);

  useEffect(() => {
    if (isVisible && !isPaused) {
      timerRef.current = setTimeout(() => handleClose(true), 3000);
    }
    return () => clearTimeout(timerRef.current);
  }, [isVisible, isPaused]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          toast={toast}
          onUndo={savedCallbacks.current.onUndo ? handleUndo : null}
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
