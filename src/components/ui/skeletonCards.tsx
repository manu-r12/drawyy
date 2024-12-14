import React from "react";
import { motion } from "framer-motion";

const SkeletonCard: React.FC = () => {
  return (
    <motion.div
      className="bg-gray-200 h-[200px] shadow-sm rounded-lg p-4 m-2 border-[1.5px] border-gray-300 flex flex-col items-center justify-center animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail Skeleton */}
      <div className="w-full h-[120px] bg-gray-300 rounded-md mb-2"></div>
      {/* Title Skeleton */}
      <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
    </motion.div>
  );
};

export default SkeletonCard;
