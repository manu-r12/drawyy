import { useState, useCallback } from 'react';
import { DrawElement, Tool, Point } from '@/types/CanvasTypes'

export const useDrawing = () => {
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [undoStack, setUndoStack] = useState<DrawElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawElement[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const addElement = useCallback((element: DrawElement) => {
    setElements(prev => [...prev, element]);
  }, []);

  const updateLastElement = useCallback((update: Partial<DrawElement>) => {
    setElements(prev => {
      const updated = [...prev];
      const lastElement = updated[updated.length - 1];
      if (lastElement) {
        // @ts-ignore
        updated[updated.length - 1] = { ...lastElement, ...update };
      }
      return updated;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, elements]);
      setElements(previousState);
    }
  }, [elements, undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, elements]);
      setElements(nextState);
    }
  }, [elements, redoStack]);

  const finishDrawing = useCallback(() => {
    setIsDrawing(false);
    setUndoStack(prev => [...prev, elements]);
    setRedoStack([]);
  }, [elements]);

  return {
    elements,
    isDrawing,
    setIsDrawing,
    addElement,
    updateLastElement,
    undo,
    redo,
    finishDrawing
  };
};