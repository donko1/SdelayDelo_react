import { createContext, useContext, useState, useRef } from "react";
import { Toast } from "@components/ui/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const savedCallbacks = useRef({ onClose: null, onUndo: null });

  const showToast = (message, type = "success", callbacks = {}) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (toast) handleClose(true);
    }

    savedCallbacks.current = {
      onClose: callbacks.onClose || null,
      onUndo: callbacks.onUndo || null,
    };

    setToast({ message, type });
  };

  const handleClose = (shouldCallOnClose = true) => {
    clearTimeout(timerRef.current);
    if (shouldCallOnClose && savedCallbacks.current.onClose) {
      savedCallbacks.current.onClose();
    }
    setToast(null);
    savedCallbacks.current = { onClose: null, onUndo: null };
  };

  const handleUndo = () => {
    if (savedCallbacks.current.onUndo) savedCallbacks.current.onUndo();
    handleClose(false);
  };

  if (toast) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => handleClose(true), 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          toast={toast}
          onClose={() => handleClose(true)}
          onUndo={savedCallbacks.current.onUndo ? handleUndo : null}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
