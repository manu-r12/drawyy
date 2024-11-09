export interface Point {
    x: number;
    y: number;
  }
  
  // Base interface for all drawing elements
interface BaseDrawElement {
    lineColor: string;
    lineWidth: number;
}
  
  // Interface for free-draw elements
interface FreeDrawElement extends BaseDrawElement {
    tool: 'freeDraw';
    points: Point[];
}
  
  // Interface for shape elements (line and rectangle)
interface ShapeElement extends BaseDrawElement {
    tool: 'line' | 'rectangle';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}
  
export type DrawElement = FreeDrawElement | ShapeElement;
  
export type Tool = DrawElement['tool'] | 'erase';