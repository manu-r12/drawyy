import { motion } from 'framer-motion';
import React from 'react';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onColorSelect }) => {
  return (
    <div className="flex items-start space-x-1">
      {colors.map((color) => (
        <div
          key={color}  
          className={`border-2 flex items-center justify-center ${
            selectedColor === color ? 'border-black' : 'border-transparent'
          } rounded-md p-[0.15rem]`}
        >
          <motion.button
            className='w-6 h-6 rounded-md'
            onClick={() => onColorSelect(color)}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: color }}
          />
        </div>
      ))}
    </div>
  );
};
