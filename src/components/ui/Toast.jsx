import { motion, AnimatePresence } from "framer-motion";

export const Toast = ({ toast }) => {
  const toastStyles = {
    info: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg ${
            toastStyles[toast.type]
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
