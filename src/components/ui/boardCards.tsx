import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiCalendar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface CardProps {
  title: string;
  thumbnail: string;
  dateCreated: string; // Prop for date
}

const Card: React.FC<CardProps> = ({ title, thumbnail, dateCreated }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <motion.div
      className="relative bg-white text-black h-[240px] shadow-sm rounded-lg p-4 m-2 border-[1.5px] border-[#e4e7eb] flex flex-col justify-between cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {/* Date Created - Top Right (Outside Image) */}
      <div className="absolute top-1 right-3 bg-white px-2 py-1 rounded-md shadow text-gray-700 text-[12px] flex items-center">
        <FiCalendar size={14} className="mr-1" />
        <span>{dateCreated}</span>
      </div>

      {/* Thumbnail Image */}
      <motion.img
        src={thumbnail}
        alt={title}
        className="w-full h-[120px] object-cover rounded-md mb-3"
        whileHover={{
          scale: 1.1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      />

      {/* Title with Favorite Button */}
      <div className="flex justify-between items-center w-full mt-2">
        <h2 className="text-md font-semibold truncate">{title}</h2>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="text-gray-500 hover:text-red-500"
        >
          {isFavorite ? (
            <FaHeart size={25} className="text-red-500" />
          ) : (
            <FiHeart size={25} />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Card;
