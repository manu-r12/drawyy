import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <motion.div
      className="bg-white text-black h-[200px] shadow-sm rounded-lg p-4 m-2 border-[1.5px] border-[#e4e7eb]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Card;
