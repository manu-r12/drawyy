import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewBoardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

const NewBoardPopup: FC<NewBoardPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = React.useState("");

  const handleCreate = () => {
    if (title.length > 0) {
      onSubmit(title);
      setTitle("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Popup container with animation */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-lg shadow-lg p-6 w-[300px]"
          >
            <h2 className="text-lg font-semibold mb-4">Enter Board Title</h2>
            <input
              type="text"
              placeholder="Board Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 outline-violet-500 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewBoardPopup;
