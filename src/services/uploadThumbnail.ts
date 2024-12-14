import axios from "axios"
import { getCanvasImageBlob } from "../utils/downloadDrawing";

export const uploadThumbnail = async (canvasRef: React.RefObject<HTMLCanvasElement>): Promise<string | undefined | null> => {
    try {
      console.log("Uploading thumbnail..........")
      const blob = await getCanvasImageBlob(canvasRef);
      if(blob){
        const formData = new FormData();
        formData.append('file', blob, 'canvas-image.png');
  
        const response = await axios.post(
          'http://127.0.0.1:8000/upload-drawing-image', 
          formData, 
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
  
        console.log("Here is the thumbnail ->", response.data.url)
        return response.data.url
      }


    } catch (error) {
      console.error('Upload failed:', error);
      return null
    } finally {

    }
  };