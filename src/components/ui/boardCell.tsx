// ListCell.tsx
import React from "react";
import { motion } from "framer-motion";

interface ListCellProps {
  title: string;
  description: string;
}

const ListCell: React.FC<ListCellProps> = ({ title, description }) => {
  return (
    <motion.div
      className="flex justify-between bg-color_gray text-black h-[100px] shadow-md rounded-lg p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-lg text-white font-bold">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default ListCell;
