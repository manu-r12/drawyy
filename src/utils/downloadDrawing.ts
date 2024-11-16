import React from "react";

export const downloadImage = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    // Create a new canvas with a white background
    const whiteCanvas = document.createElement('canvas');
    whiteCanvas.width = canvas.width;
    whiteCanvas.height = canvas.height;
    const whiteCtx = whiteCanvas.getContext('2d');
  
    if (!whiteCtx) return;
  
    // Fill with white background
    whiteCtx.fillStyle = '#000';
    whiteCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
    whiteCtx.drawImage(canvas, 0, 0);
  
    // Convert canvas to image and trigger download
    const link = document.createElement('a');
    link.href = whiteCanvas.toDataURL('image/png');
    link.download = 'canvas-drawing.png';
    link.click();
  };