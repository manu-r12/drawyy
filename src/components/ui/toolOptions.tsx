import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorPicker } from '../controls/colorPicker';

interface ToolOptionsProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onStrokeSet: (stroke: number) => void;
  tool: string; 
}

const COLORS = ['#000', '#FF5733', '#3498db', '#FFB200', '#2ecc71', '#22177A'];
const STROKE_WIDTHS = [2, 4, 6, 8, 10];

const ToolOptions: React.FC<ToolOptionsProps> = ({ selectedColor, onColorSelect, onStrokeSet, tool }) => {
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  const handleStrokeChange = (stroke: number) => {
    setStrokeWidth(stroke);
    onStrokeSet(stroke);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {tool != "erase" && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          className='absolute p-3 bg-[#ffffff] rounded-md border-solid border-[#e4e7eb] border-[1.5px] shadow-md top-[140px] left-[20px] w-[250px] h-[400px]'
        >
          <div className='flex flex-col gap-4'>
            <div>
              <p className='text-sm font-normal mb-2'>Stroke Color</p>
              <ColorPicker
                colors={COLORS}
                selectedColor={selectedColor}
                onColorSelect={onColorSelect}
              />
            </div>
            <div>
              <p className='text-sm font-normal mb-2'>Stroke Width</p>
              <div className='flex gap-2'>
                {STROKE_WIDTHS.map((width) => (
                  <button
                    key={width}
                    onClick={() => handleStrokeChange(width)}
                    className={`w-10 h-10 flex justify-center items-center border ${
                      strokeWidth === width ? 'bg-purple-100' : 'bg-gray-100'
                    } rounded-md`}
                  >
                    <div
                      className='w-6 h-6'
                      style={{
                        borderBottom: `${width}px solid ${selectedColor}`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className='flex justify-center items-center h-20'>
              <div
                className='w-40 h-10 rounded-md'
                style={{
                  border: `${strokeWidth}px solid ${selectedColor}`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolOptions;
