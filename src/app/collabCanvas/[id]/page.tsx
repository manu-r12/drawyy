"use client"
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useDrawing } from "@/hooks/useDrawing";
import { DrawElement, Tool } from "@/types/CanvasTypes";
import { drawElement } from "@/utils/drawingUtils";
import rough from "roughjs/bin/rough";
import { 
  FaPencilAlt, 
  FaGripLines, 
  FaRegSquare, 
  FaEraser, 
  FaFont, 
  FaUndo, 
  FaRedo,
  FaUsers
} from "react-icons/fa";
import { PiEmptyBold } from "react-icons/pi";
import { HiColorSwatch } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { uploadThumbnail } from "@/services/uploadThumbnail";
import { updateCollabThumbnail } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCollabSession } from "@/store/collabSessionState/selector";
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import {motion} from "framer-motion"
import { shareOnWhatsapp } from "@/utils/socialMedia";

interface ConnectedUser {
  userId: string;
  userName: string;
}

const CollaborativeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const isDrawingRef = useRef(false);
  const [tool, setTool] = useState<Tool>("freeDraw");
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [sessionEndNotification, setSessionEndNotification] = useState<{
    show: boolean;
    endedBy: string;
  }>({ show: false, endedBy: "" });
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCreatedByYou, setIsCreatedByYou] = useState<boolean>(false)
  
  const { data: session } = useSession();
  const fullPath = usePathname();
  const drawingId = fullPath.split("/").pop();

  const collabSession = useSelector(selectCollabSession);

  console.log("Here is the Collab Session State: ", collabSession)

  const connectedUsersCollections = []

  const {
    elements,
    isDrawing,
    setIsDrawing,
    addElement,
    updateLastElement,
    undo,
    redo,
  } = useDrawing();

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000"
  ];

  const router = useRouter()


  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${drawingId}`);
    
    ws.onopen = () => {

      console.log('Connected to WebSocket');

      setConnectedUsers([
        {
        userId: session?.user.id ?? "",
        userName: session?.user.name ?? ""
      }])

      ws.send(JSON.stringify({

        type: 'user_connected',
        user: {
          uid: session?.user.id ?? " ",
          name: session?.user.name ?? " ",
          email: session?.user.email ?? " "
        },

      }));

    };

    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);
      
      switch (data.type) {

        case 'draw_update':
            // console.log("draw_update called on WebSocket")
            handleRemoteDrawing(data.element);
          break;

        case 'initial_drawing_state':

          console.log("Here are the joined users - ", data.joined_users)

          setIsCreatedByYou(data.created_by == session?.user.id)
          data.elements.forEach(handleRemoteDrawing);
          break;


          case 'user_connected':

            console.log("Here are the joined users - ", data.joined_users)
            setConnectedUsers(prev => [
              ...prev,
              ...data.joined_users.map((user: any) => ({
                userId: user.uid, 
                userName: user.name 
              }))
            ]);
            break;
          

        case 'user_disconnected':

          setConnectedUsers(prev => 
            prev.filter(user => user.userId !== data.userId)
          );
          break;


        case 'session_ended':

          setSessionEndNotification({
            show: true,
            endedBy: data.user.name
          });
          break;
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [drawingId, session?.user?.id]);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { left, top } = canvas.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;

    if (tool === "erase") return;

    if (tool === "text") {
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

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'draw_update',
        user: {
          uid: session?.user.id ?? " ",
          name: session?.user.name ?? " ",
          email: session?.user.email ?? " "
        },
        element: newElement
      }));
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const { left, top } = canvas.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;
    
    const lastElement = elements[elements.length - 1];
    
    if (lastElement && tool === "freeDraw" && "points" in lastElement) {
      const updatedElement = {
        ...lastElement,
        points: [...lastElement.points, { x: offsetX, y: offsetY }],
      };
      updateLastElement(updatedElement);
  
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'draw_update',
          user: {
            uid: session?.user.id ?? " ",
            name: session?.user.name ?? " ",
            email: session?.user.email ?? " "
          },
          element: updatedElement,
        }));
      }
    } else if (lastElement) {
      updateLastElement({ endX: offsetX, endY: offsetY });
  
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'draw_update',
          user: {
            uid: session?.user.id ?? " ",
            name: session?.user.name ?? " ",
            email: session?.user.email ?? " "
          },
          element: { ...lastElement, endX: offsetX, endY: offsetY },
        }));
      }
    }
  };

  const cancelSession = async () => {
    const thumbUrl = await uploadThumbnail(canvasRef)
    console.log("Got the url", thumbUrl)
    await updateCollabThumbnail(session?.user.id ?? "", drawingId!, thumbUrl ?? "")
    
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'session_ended',
        user: {
          uid: session?.user.id ?? "",
          name: session?.user.name ?? ""
        }
      }));
    }
    
    router.push("/")
  }

  const handleRemoteDrawing = (element: DrawElement) => {
    addElement(element);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const roughCanvas = rough.canvas(canvas);
    drawElement(context, roughCanvas, element);
  };

  const toggleShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    isDrawingRef.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => drawElement(context, roughCanvas, element));
  }, [elements]);

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-gray-100">
    {showShareModal && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "keyframes", stiffness: 300 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Share Session</h2>
            
            
            <div className="mb-6">
              <div className="border-2 border-violet-500 rounded-lg p-3 mb-2">
                <h3 className="font-semibold text-gray-700">Session Name</h3>
                <p className="text-gray-600">{collabSession.sessionName}</p>
              </div>

              <div className="border-2 border-violet-500 rounded-lg p-3">
                <h3 className="font-semibold text-gray-700">Session URL</h3>
                <p className="text-gray-600">{window.location.href}</p>
              </div>
            </div>

            
            <div className="flex justify-center space-x-6 mb-6">
              <div className="flex flex-col items-center hover:bg-gray-200 p-2 rounded-r-lg" onClick={() => shareOnWhatsapp(fullPath)}>
                <FaWhatsapp size={30} className="text-green-500" />
                <p className="text-sm">WhatsApp</p>
              </div>
              <div className="flex flex-col items-center  hover:bg-gray-200 p-2 rounded-r-lg">
                <FaTwitter size={30} className="text-blue-500" />
                <p className="text-sm">Twitter</p>
              </div>
              <div className="flex flex-col items-center  hover:bg-gray-200 p-2 rounded-r-lg">
                <FaFacebook size={30} className="text-blue-700" />
                <p className="text-sm">Facebook</p>
              </div>
              <div className="flex flex-col items-center  hover:bg-gray-200 p-2 rounded-r-lg">
                <FaLinkedin size={30} className="text-blue-800" />
                <p className="text-sm">LinkedIn</p>
              </div>
            </div>

            <button
              onClick={toggleShareModal}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition duration-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Session Name Title */}
      <div className="absolute top-4 left-4 text-xl font-bold text-gray-800">
        {collabSession.sessionName}
      </div>
      {/* Session End Notification */}
      {sessionEndNotification.show && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Session Ended</h2>
          <p className="text-gray-600 mb-6">
            The session was ended by {sessionEndNotification.endedBy}.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
      )}

      {/* Tool Options Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md border-solid border-[#e4e7eb] border-[1.5px] shadow-slate-100 rounded-[20px] px-5 py-3 flex items-center gap-2 space-x-4">
        {[
          { tool: "freeDraw", icon: <FaPencilAlt size={20} /> },
          { tool: "line", icon: <FaGripLines size={20} /> },
          { tool: "rectangle", icon: <FaRegSquare size={20} /> },
          { tool: "erase", icon: <FaEraser size={20} /> },
          { tool: "text", icon: <FaFont size={20} /> },
        ].map((item) => (
          <button
            key={item.tool}
            className={`p-2 rounded-lg transition-all duration-200 ${
              tool === item.tool 
                ? "bg-violet-100 text-violet-600" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
            onClick={() => setTool(item.tool as Tool)}
          >
            {item.icon}
          </button>
        ))}

        <div className="relative">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <HiColorSwatch size={20} style={{ color: lineColor }} />
          </button>
          
          {showColorPicker && (
            <div className="absolute  top-12 left-0 bg-white shadow-lg rounded-lg p-2 grid grid-cols-5 gap-10 z-10">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setLineColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <PiEmptyBold size={20} />
        </button>
        
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          onClick={undo}
        >
          <FaUndo size={20} />
        </button>
        
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          onClick={redo}
        >
          <FaRedo size={20} />
        </button>
      </div>

      {/* Connected Users Button */}
      <div className="absolute top-4 flex items-center justify-center gap-4 right-4">
       {isCreatedByYou && <div>
        <button
            onClick={cancelSession}
            className="bg-violet-600 text-white text-md font-normal py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        >Stop Session</button>
        </div>}
        <button
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600 flex items-center space-x-2"
          onClick={() => setShowUsers(!showUsers)}
        >
          <FaUsers size={20} />
          <span className="text-sm font-medium">{connectedUsers.length}</span>
        </button>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          onClick={toggleShareModal}
        >
          <FaGripLines size={20} />
        </button>

        {/* Connected Users Panel */}
        {showUsers && (
          <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-64 p-4 z-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Connected Users</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowUsers(false)}
              >
                <IoMdClose size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {connectedUsers.map((user, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-gray-600">{user.userName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        className="border border-gray-300 bg-white shadow-md"
        style={{ cursor: tool === "freeDraw" ? "crosshair" : "default" }}
      />
    </div>
  );
};

export default CollaborativeCanvas;
