import { motion } from 'framer-motion';
import React from 'react';

interface ToolButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

export const ToolButton: React.FC<ToolButtonProps> = ({ icon, isActive, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`p-[0.5rem] font-normal rounded-md ${isActive ? 'bg-violet-100 text-black' : ''} hover:bg-violet-300`}
  >
    {icon}
  </motion.button>
);
