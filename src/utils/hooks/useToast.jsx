import { useState, useEffect, useRef } from "react";
import { Toast } from "@components/ui/Toast";

export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const savedOnClose = useRef(null);

  const showToast = (message, type = "info", onClose) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    savedOnClose.current = onClose;
    setToast({ message, type });
  };

  const handleClose = (callOnClose = true) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (callOnClose && savedOnClose.current) {
      savedOnClose.current();
    }

    setToast(null);
    savedOnClose.current = null;
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
      onUndo={savedOnClose.current ? () => handleClose(false) : null}
    />
  );

  return { showToast, ToastContainer };
}
