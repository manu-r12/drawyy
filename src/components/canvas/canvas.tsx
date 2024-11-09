"use client"
import { useEffect, useRef, useState } from "react";

const DrawingApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  
  // Draggable menu position state
  const [menuPosition, setMenuPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    prepareCanvas();
  }, []);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      if (contextRef.current) {
        contextRef.current.closePath();
      }
      setIsDrawing(false);
      saveState();
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL();
      setHistory((prevHistory) => [...prevHistory, url]);
      setRedoStack([]); // Clear redo stack on new action
    }
  };

  const restoreState = (dataUrl: string) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const previousState = history[history.length - 2];
    setRedoStack((prev) => [history[history.length - 1], ...prev]);
    setHistory(history.slice(0, history.length - 1));
    restoreState(previousState);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[0];
    setRedoStack(redoStack.slice(1));
    setHistory((prevHistory) => [...prevHistory, nextState]);
    restoreState(nextState);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Draggable Menu Handlers
  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - menuPosition.x,
      y: e.clientY - menuPosition.y,
    };
  };

  const drag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMenuPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-black block bg-white w-full h-screen"
      />

      {/* Floating Menu */}
      <div
        className="absolute bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 w-44 cursor-move"
        style={{
          left: menuPosition.x,
          top: menuPosition.y,
        }}
        onMouseDown={startDragging}
        onMouseMove={drag}
        onMouseUp={stopDragging}
      >
        <label className="flex items-center space-x-2">
          <span>Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              if (contextRef.current) {
                contextRef.current.strokeStyle = e.target.value;
              }
            }}
            className="h-8 w-8 rounded-full border-2 border-gray-300"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>Brush:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setBrushSize(size);
              if (contextRef.current) {
                contextRef.current.lineWidth = size;
              }
            }}
            className="w-full"
          />
        </label>
        <button onClick={undo} className="bg-blue-500 text-white rounded-lg px-3 py-1">Undo</button>
        <button onClick={redo} className="bg-blue-500 text-white rounded-lg px-3 py-1">Redo</button>
        <button onClick={clearCanvas} className="bg-red-500 text-white rounded-lg px-3 py-1">Clear</button>
        <button onClick={saveImage} className="bg-green-500 text-white rounded-lg px-3 py-1">Save</button>
      </div>
    </div>
  );
};

export default DrawingApp;
