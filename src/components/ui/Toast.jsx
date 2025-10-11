import { motion, AnimatePresence } from "framer-motion";
import SuccessIcon from "@assets/toast_success.svg?react";
import DeleteIcon from "@assets/toast_delete.svg?react";
import WarningIcon from "@assets/toast_warning.svg?react";
import { useLang } from "@context/LangContext";
import { chooseTextByLang } from "@/utils/helpers/locale";

export const Toast = ({
  toast,
  isVisible,
  onUndo,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { lang } = useLang();

  const toastIcons = {
    success: SuccessIcon,
    delete: DeleteIcon,
    warning: WarningIcon,
  };

  const IconComponent = toast ? toastIcons[toast.type] : "";

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          className="fixed z-50 inset-x-0 bottom-4 flex justify-center"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="bg-neutral-900 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-black py-1 px-[15px] min-w-[300px] min-h-[80px] flex justify-center">
            <div className="flex items-center justify-between gap-4">
              <IconComponent />
              <h2 className="text-white text-2xl font-bold font-['Inter'] ">
                {toast.message}
              </h2>

              {onUndo && (
                <h1
                  onClick={onUndo}
                  className="text-white text-2xl font-extrabold font-['Inter'] underline hover:no-underline hover:bg-opacity-30 transition-all duration-300 cursor-pointer"
                >
                  {chooseTextByLang("Отменить", "Undo", lang)}
                </h1>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
