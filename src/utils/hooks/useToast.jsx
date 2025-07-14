import { useState, useEffect } from "react";
import { Toast } from "@components/ui/Toast";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const ToastContainer = () => <Toast toast={toast} />;

  return { showToast, ToastContainer };
}
