import React from "react";
import { motion } from "framer-motion";

interface ListCellProps {
  title: string;
  thumbnail: string;
}

const ListCell: React.FC<ListCellProps> = ({ title, thumbnail }) => {
  return (
    <motion.div
      className="flex items-center bg-white text-black h-[100px] shadow-sm rounded-lg p-4 border-[1.5px] border-[#e4e7eb] space-x-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="w-[80px] h-[80px] flex-shrink-0">
        <img
          alt="thumbnail"
          src={thumbnail}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Title */}
      <div className="flex-grow">
        <h2 className="text-lg font-bold text-gray-800 truncate">{title}</h2>
      </div>
    </motion.div>
  );
};

export default ListCell;
