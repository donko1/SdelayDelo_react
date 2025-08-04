import { useState, useEffect, useRef } from "react";
import { Toast } from "@components/ui/Toast";

export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const savedCallbacks = useRef({ onClose: null, onUndo: null });

  const showToast = (message, type = "success", callbacks = {}) => {
    if (timerRef.current) {
      if (toast) {
        handleClose(true);
      }

      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    savedCallbacks.current = {
      onClose: callbacks.onClose || null,
      onUndo: callbacks.onUndo || null,
    };

    setToast({ message, type });
  };

  const handleClose = (shouldCallOnClose = true) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (shouldCallOnClose && savedCallbacks.current.onClose) {
      savedCallbacks.current.onClose();
    }

    setToast(null);
    savedCallbacks.current = { onClose: null, onUndo: null };
  };

  const handleUndo = () => {
    if (savedCallbacks.current.onUndo) {
      savedCallbacks.current.onUndo();
    }
    handleClose(false);
  };

  useEffect(() => {
    if (!toast) return;

    timerRef.current = setTimeout(() => {
      handleClose(true);
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast]);

  const ToastContainer = () => (
    <Toast
      toast={toast}
      onUndo={savedCallbacks.current.onUndo ? handleUndo : null}
    />
  );

  return { showToast, ToastContainer };
}
