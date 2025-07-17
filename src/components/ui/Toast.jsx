import { motion, AnimatePresence } from "framer-motion";

export const Toast = ({ toast, onUndo }) => {
  const toastStyles = {
    info: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  console.log(onUndo);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-0 bottom-4 flex justify-center"
        >
          <div
            className={`px-6 py-3 rounded-md shadow-lg ${
              toastStyles[toast.type]
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{toast.message}</span>

              {onUndo && (
                <button
                  onClick={onUndo}
                  className="px-3 py-1 ml-3 text-sm font-medium uppercase bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                >
                  Undo
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
