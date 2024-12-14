"use client";
import { ToolButton } from "@/components/controls/toolbutton";
import EditableHeading from "@/components/ui/editableHeading";
import ToolOptions from "@/components/ui/toolOptions";
import { useDrawing } from "@/hooks/useDrawing";
import { checkIfDrawingExists, fetchDrawingById} from "@/services/drawingService";
import { selectBoard } from "@/store/boardState/selector";
import { DrawElement, Drawing, Tool } from "@/types/CanvasTypes";
import { downloadImage } from "@/utils/downloadDrawing";
import { drawElement } from "@/utils/drawingUtils";
import { saveDrawing } from "@/utils/saveDrawing";
import { renameDrawingTitle } from "@/utils/updateDrawingTitle";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDownload, AiOutlineShareAlt } from "react-icons/ai";
import {
  FaEraser,
  FaFont,
  FaGripLines,
  FaPencilAlt,
  FaRedo,
  FaRegSquare,
  FaUndo,
} from "react-icons/fa";
import { PiEmptyBold } from "react-icons/pi";
import { TbCloudCheck } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import rough from "roughjs/bin/rough";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<Tool>("freeDraw");
  const [lineColor, setLineColor] = useState("#000");
  const [lineWidth, setLineWidth] = useState(2);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [drawingExists, setDrawingExists] = useState(false);
  const [drawingData, setDrawingData] = useState<Drawing | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const { data } = useSession();
  const fullPath = usePathname();
  const id = fullPath.split("/").pop();
  const board = useSelector(selectBoard);

  const {
    elements,
    isDrawing,
    setIsDrawing,
    addElement,
    updateLastElement,
    undo,
    redo,
    finishDrawing,
  } = useDrawing();

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const placeText = () => {
    if (text && textPosition) {
      const newElement: DrawElement = {
        tool: "text",
        text: text,
        position: { x: textPosition.x, y: textPosition.y },
        fontSize: 20,
      };
      addElement(newElement);
      setText(""); 
      setTextPosition(null); 
    }
  };


  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { left, top } = canvas.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;

    if (tool === "erase") return;

    if (tool === "text") {
      setTextPosition({ x: offsetX, y: offsetY });
      return;
    }

    const newElement: DrawElement =
      tool === "freeDraw"
        ? {
            tool: "freeDraw",
            points: [{ x: offsetX, y: offsetY }],
            lineColor,
            lineWidth,
          }
        : {
            tool,
            startX: offsetX,
            startY: offsetY,
            endX: offsetX,
            endY: offsetY,
            lineColor,
            lineWidth,
          };

    addElement(newElement);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || tool === "text") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { left, top } = canvas.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;

    if (tool === "freeDraw") {
      const lastElement = elements[elements.length - 1];
      if (lastElement && "points" in lastElement) {
        updateLastElement({
          ...lastElement,
          points: [...lastElement.points, { x: offsetX, y: offsetY }],
        });
      }
    } else {
      updateLastElement({ endX: offsetX, endY: offsetY });
    }
  };

  // check if the collab drawing data is saved or not in the use collocations
  // if not, create it otherwise ignore it 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => drawElement(context, roughCanvas, element));
  }, [elements]);


  useEffect(() => {
    const checkDrawing = async () => {
      const exists = await checkIfDrawingExists(data?.user.id ?? "", id!);
      setDrawingExists(exists);

      if (exists) {
        // Fetch the saved drawing and load it onto the canvas
        const data = await fetchDrawingById(id!);
        setDrawingData(data)
        console.log("Set Drawing Data:", data)
        if (data) {
          data.elements.forEach((element: DrawElement) => addElement(element));
        }
      }
    };
    checkDrawing();
  }, [data?.user.id, id]);


  const renameTitleHandler = async (newTitle: string) => {
    console.log("New Title: ", newTitle)
    console.log("Updating Title....")
    await renameDrawingTitle(id!, newTitle, data?.user.id ?? "")
  }

  // sync changes with "the" existing drawing 
  const updateDrawing = () => {
    console.log("updateDrawing.....");
  }

  // save the drawing for the first time (useage : should be used only once)
  const saveDrawingData = async () => {
    const drawing = {
      drawingId: id!,
      title: board.title ?? "Untitled Board",
      elements,
    };
    console.log("Drawing:", drawing)
    await saveDrawing(drawing, data?.user.id ?? "", canvasRef, board.title ?? "Untitled Board");
    setDrawingExists(true)
  };

  const persistDrawingData = async () => {
    if (drawingExists){
      updateDrawing();
    }else {
      await saveDrawingData()
    }
    // setIsSaved(true)
  }

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-gray-100">
    
      <EditableHeading onTitleUpdate={renameTitleHandler} boardtitle={drawingData?.title ?? board.title!}/>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        className="border border-gray-300 bg-[#ffffff] shadow-md"
        style={{ cursor: tool === "freeDraw" ? "crosshair" : "default" }}
        />

      {tool === "text" && textPosition && (
        <input
          type="text"
          value={text}
          onChange={handleTextInput}
          onBlur={placeText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              placeText();
              console.log("Elements", elements)
            }
          }}
          style={{
            position: "absolute",
            left: textPosition.x,
            top: textPosition.y,
            border: "none",
            outline: "none",
            background: "transparent",
            color: lineColor,
            fontSize: `${20}px`,
            zIndex: 10,
          }}
        />
      )}
      <div className="absolute top-3 right-4 rounded-full p-5  flex items-center space-x-4">
        {drawingExists &&
            <div className="p-2 rounded-full bg-violet-100 shadow-md">
              <TbCloudCheck className="h-8 w-8 text-violet-500"/>
            </div>
        }
        <button
            onClick={() => {
              downloadImage(canvasRef)
            }}
            className="p-2 shadow-md bg-white rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <AiOutlineDownload className="h-7 w-7 text-black" />
        </button>
        <button className="p-2 shadow-md bg-white rounded-full hover:bg-gray-200 focus:outline-none">
          <AiOutlineShareAlt className="h-7 w-7 text-black" />
        </button>
      </div>

     <ToolOptions tool={tool} onColorSelect={setLineColor} selectedColor={lineColor} onStrokeSet={setLineWidth}/>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md border-solid border-[#e4e7eb] border-[1.5px] shadow-slate-100 rounded-[20px] px-5 py-3 flex items-center gap-2 space-x-4">
        {[
          { tool: "freeDraw", icon: <FaPencilAlt size={20} /> },
          { tool: "line", icon: <FaGripLines size={20} /> },
          { tool: "rectangle", icon: <FaRegSquare size={20} /> },
          { tool: "erase", icon: <FaEraser size={20} /> },
          { tool: "text", icon: <FaFont size={20} /> },
        ].map((item) => (
          <ToolButton
            key={item.tool}
            icon={item.icon}
            isActive={tool === item.tool}
            onClick={() => setTool(item.tool as Tool)}
          />
        ))}

        <ToolButton icon={<PiEmptyBold size={20} />} onClick={() => {}} />
        <ToolButton icon={<FaUndo size={20} />} onClick={undo} />
        <ToolButton icon={<FaRedo size={20} />} onClick={redo} />


        <motion.button
          onClick={persistDrawingData}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-md ${isSaved ? ` bg-violet-500` : `bg-red-500` } focus:bg-violet-400 hover:bg-green-400 text-white`}
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};

export default Canvas;
