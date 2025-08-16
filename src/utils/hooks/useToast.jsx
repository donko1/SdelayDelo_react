import { useToast } from "@/context/ToastContext";

export const useToastHook = () => {
  const { showToast } = useToast();
  return { showToast };
};
