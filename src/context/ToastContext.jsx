import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Toast } from "@components/ui/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const savedCallbacks = useRef({ onClose: null, onUndo: null });

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message, type = "success", callbacks = {}) => {
      // Немедленно закрываем предыдущий тост
      setIsVisible(false);
      clearAllTimers();

      // Устанавливаем новый тост после небольшой задержки для анимации
      setTimeout(() => {
        savedCallbacks.current = {
          onClose: callbacks.onClose || null,
          onUndo: callbacks.onUndo || null,
        };

        setToast({ message, type, id: Date.now() });
        setIsVisible(true);

        // Запускаем таймер автоматического закрытия
        timerRef.current = setTimeout(() => {
          handleClose(true);
        }, 3000);
      }, 50); // Минимальная задержка для плавного перехода
    },
    [clearAllTimers]
  );

  const handleClose = useCallback(
    (shouldCallOnClose = true) => {
      setIsVisible(false);
      clearAllTimers();

      setTimeout(() => {
        if (shouldCallOnClose && savedCallbacks.current.onClose) {
          savedCallbacks.current.onClose();
        }
        setToast(null);
        savedCallbacks.current = { onClose: null, onUndo: null };
      }, 300);
    },
    [clearAllTimers]
  );

  const handleUndo = useCallback(() => {
    if (savedCallbacks.current.onUndo) savedCallbacks.current.onUndo();
    handleClose(false);
  }, [handleClose]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (isVisible && toast) {
      timerRef.current = setTimeout(() => {
        handleClose(true);
      }, 3000);
    }
  }, [isVisible, toast, handleClose]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          toast={toast}
          isVisible={isVisible}
          onUndo={savedCallbacks.current.onUndo ? handleUndo : null}
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
