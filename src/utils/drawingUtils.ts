import { DrawElement } from '@/types/CanvasTypes';
import { RoughCanvas } from 'roughjs/bin/canvas';
import {useDrawing} from "@/hooks/useDrawing";

export const drawElement = (
  context: CanvasRenderingContext2D,
  roughCanvas: RoughCanvas,
  element: DrawElement
) => {

  if (element.tool === 'freeDraw') {
    context.beginPath();
    context.strokeStyle = element.lineColor;
    context.lineWidth = element.lineWidth;
    context.moveTo(element.points[0].x, element.points[0].y);
    element.points.forEach((point) => context.lineTo(point.x, point.y));
    context.stroke();
  } else {
    // Handle shape elements (line and rectangle)
    if (element.tool === 'line') {
      roughCanvas.line(
        element.startX,
        element.startY,
        element.endX,
        element.endY,
        {
          stroke: element.lineColor,
          strokeWidth: element.lineWidth,
        }
      );
    } else if (element.tool === 'rectangle') {
      roughCanvas.rectangle(
        element.startX,
        element.startY,
        element.endX - element.startX,
        element.endY - element.startY,
        {
          stroke: element.lineColor,
          strokeWidth: element.lineWidth,
        }
      );
    }
  }
};