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
    className={`p-2 rounded-full ${isActive ? 'bg-blue-500 text-white' : ''}`}
  >
    {icon}
  </motion.button>
);
