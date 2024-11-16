"use client";
import React, { useRef, useEffect, useState } from 'react';

import { FaUndo, 
        FaRedo, 
        FaEraser, 
        FaPencilAlt, 
        FaRegSquare, 
        FaGripLines } 
from 'react-icons/fa';
import { AiOutlineDownload, AiOutlineShareAlt } from 'react-icons/ai';


import { motion } from 'framer-motion';
import rough from 'roughjs/bin/rough';
import { Tool, 
        DrawElement } from '@/types/CanvasTypes';
import { useDrawing } from '@/hooks/useDrawing';
import { ToolButton } from '@/components/controls/toolbutton';
import { ColorPicker } from '@/components/controls/colorPicker';
import { drawElement } from '@/utils/drawingUtils';
import { downloadImage } from '@/utils/downloadDrawing';
import { usePathname, useRouter } from "next/navigation";

const COLORS = ['#fff', 
                '#FF5733', 
                '#3498db', 
                '#2ecc71'
            ];

const Canvas: React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<Tool>('freeDraw');
  const [lineColor, setLineColor] = useState('#fff');
  const [lineWidth, setLineWidth] = useState(5);

  const router = useRouter();
  const id = usePathname()

  console.log("The Canvas id is -> ", id)
  
  const {
    elements,
    isDrawing,
    setIsDrawing,
    addElement,
    updateLastElement,
    undo,
    redo,
    finishDrawing
  } = useDrawing();

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (tool === 'erase') {
      // Handle eraser tool separately
      return;
    } 
    
    if (tool === 'freeDraw') {
      const newElement: DrawElement = {
        tool: 'freeDraw',
        points: [{ x: offsetX, y: offsetY }],
        lineColor,
        lineWidth,
      };
      addElement(newElement);
    } else {
      const newElement: DrawElement = {
        tool,
        startX: offsetX,
        startY: offsetY,
        endX: offsetX,
        endY: offsetY,
        lineColor,
        lineWidth,
      };
      addElement(newElement);
    }
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    
    if (tool === 'erase') {
      return;
    }
    
    if (tool === 'freeDraw') {
      const lastElement = elements[elements.length - 1];
      if (lastElement && 'points' in lastElement) {
        updateLastElement({
          points: [...lastElement.points, { x: offsetX, y: offsetY }]
        });
      }
    } else {
      updateLastElement({ endX: offsetX, endY: offsetY });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(element => drawElement(context, roughCanvas, element));
  }, [elements]);

  const saveDrawing = async () => {
    try {
      await fetch('/api/save-drawing', { method: 'POST', body: JSON.stringify(elements) });
      console.log("Here are all the elements =>", JSON.stringify(elements))
      alert('Drawing saved successfully');
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-gray-100">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        className="border border-gray-300 bg-black shadow-md"
      />

    <div className="absolute top-4 right-4 rounded-full p-5 flex items-center space-x-4">
         <button onClick={() => downloadImage(canvasRef)} className="p-2 shadow-md bg-white rounded-full hover:bg-gray-200 focus:outline-none">
                    <AiOutlineDownload className="h-7 w-7 text-black" />
                </button>
                <button className="p-2 shadow-md bg-white rounded-full hover:bg-gray-200 focus:outline-none">
                    <AiOutlineShareAlt className="h-7 w-7 text-black" />
                </button>
    </div>

    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg shadow-slate-300 rounded-full p-5 flex items-center space-x-4">
        {[
          { tool: 'freeDraw', icon: <FaPencilAlt size={24} /> },
          { tool: 'line', icon: <FaGripLines size={24} /> },
          { tool: 'rectangle', icon: <FaRegSquare size={24} /> },
          { tool: 'erase', icon: <FaEraser size={24} /> },
        ].map((item) => (
          <ToolButton
            key={item.tool}
            icon={item.icon}
            isActive={tool === item.tool}
            onClick={() => setTool(item.tool as Tool)}
          />
        ))}

        <ToolButton icon={<FaUndo size={24} />} onClick={undo} />
        <ToolButton icon={<FaRedo size={24} />} onClick={redo} />

        <ColorPicker
          colors={COLORS}
          selectedColor={lineColor}
          onColorSelect={setLineColor}
        />

        <motion.button
          onClick={saveDrawing}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-md bg-blue-500 text-white"
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};

export default Canvas;