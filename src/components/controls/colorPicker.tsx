import { motion } from 'framer-motion';
import React from 'react';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onColorSelect }) => (
  <div className="flex space-x-2">
    {colors.map((color) => (
      <motion.button
        key={color}
        onClick={() => onColorSelect(color)}
        whileTap={{ scale: 0.9 }}
        className={`w-6 h-6 rounded-full border-2 ${
          selectedColor === color ? 'border-blue-500' : 'border-transparent'
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);