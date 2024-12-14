import React from "react";
/**
 * Converts a canvas element to an image Blob with a white background.
 * @param canvasRef - The reference to the canvas element.
 * @returns A promise that resolves to a Blob of the image.
 */
export const getCanvasImageBlob = (
    canvasRef: React.RefObject<HTMLCanvasElement>
): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return Promise.resolve(null);

    const whiteCanvas = document.createElement("canvas");
    whiteCanvas.width = canvas.width;
    whiteCanvas.height = canvas.height;
    const whiteCtx = whiteCanvas.getContext("2d");

    if (!whiteCtx) return Promise.resolve(null);


    whiteCtx.fillStyle = "#fff";
    whiteCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
    whiteCtx.drawImage(canvas, 0, 0);

    return new Promise((resolve) => {
        whiteCanvas.toBlob((blob) => {
            resolve(blob);
        }, "image/png");
    });
};


export const downloadImage = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const whiteCanvas = document.createElement('canvas');
    whiteCanvas.width = canvas.width;
    whiteCanvas.height = canvas.height;
    const whiteCtx = whiteCanvas.getContext('2d');
  
    if (!whiteCtx) return;
  
    whiteCtx.fillStyle = '#000';
    whiteCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
    whiteCtx.drawImage(canvas, 0, 0);
  
    const link = document.createElement('a');
    link.href = whiteCanvas.toDataURL('image/png');
    link.download = 'canvas-drawing.png';
    link.click();
  };