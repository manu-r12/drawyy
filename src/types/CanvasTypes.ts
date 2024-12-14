export interface Point {
    x: number;
    y: number;
}

export interface DrawingData {
    id: string;
    title: string;
    createdAt: string;
    thumbnail: string;
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

// New interface for text elements
interface TextElement {
    tool: 'text';
    text: string;
    position: Point;
    fontSize: number;
}

// Updated DrawElement type to include TextElement
export type DrawElement = FreeDrawElement | ShapeElement | TextElement;

// Updated Tool type to include 'text'
export type Tool = DrawElement['tool'] | 'erase';

export interface Drawing {
    drawingId: string;
    title: string;
    elements: DrawElement[];
}
