import axios, { AxiosError } from 'axios';
import {DrawElement, Drawing} from "@/types/CanvasTypes";
import { CollabDrawing } from '@/types/CollabCanvas';

const backendUrl = 'http://127.0.0.1:8000'

// Enum for drawing statuses
enum DrawingStatus {
  Exists = "exists",
  Success = "success",
  Failure = "failure",
  Error = "error"
}

// Response type interface
interface SaveDrawingResponse {
  status: DrawingStatus;
  message: string;
  drawing?: Drawing; 
}

// Function to save the drawing
export const saveDrawingToDatabase = async (drawing: Drawing): Promise<SaveDrawingResponse> => {
  try {
    console.log("Drawing Data for upload ->", drawing)
    const response = await axios.post(`${backendUrl}/save_drawing`, drawing);
    const responseData = response.data;

    switch (responseData.status) {
      case DrawingStatus.Exists:
        console.warn('Drawing already exists:', responseData.drawing);
        return {
          status: DrawingStatus.Exists,
          message: "Drawing already exists.",
          drawing: responseData.drawing
        };

      case DrawingStatus.Success:
        console.info('Drawing saved successfully:', responseData.drawing);
        return {
          status: DrawingStatus.Success,
          message: "Drawing saved successfully.",
          drawing: responseData.drawing
        };

      default:
        console.error('Failed to save drawing:', responseData.message);
        return {
          status: DrawingStatus.Failure,
          message: "Failed to save drawing."
        };
    }

  } catch (error) {
    // Handle Axios-specific errors
    if (error instanceof AxiosError) {
      console.error('Axios error:', error.message);
      return {
        status: DrawingStatus.Error,
        message: `Network error: ${error.message}`
      };
    }

    // Handle generic errors
    console.error('Unexpected error:', error);
    return {
      status: DrawingStatus.Error,
      message: "An unexpected error occurred."
    };
  }
};

export const checkIfDrawingExists = async (uid: string, drawingId: string) => {
  try {
    console.log("Checkig")
    const response = await axios.get(`${backendUrl}/get-drawing-by-id`, {
      params: { drawing_id: drawingId!, uid: uid }
    });
    console.log("Got the drawing data by uid:", response.data.exists, response.data.drawing)
    return response.data.exists;
  } catch (error) {
    console.error("Error checking drawing:", error);
    return false;
  }
};

export const fetchDrawingById = async (drawingId: string): Promise<Drawing> => {
  try {
    const response = await axios.get(`${backendUrl}/drawing/${drawingId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching drawing:", error);
    throw new Error("Failed to fetch drawing");
  }
};


interface UpdateDrawingTitleResponse {
  status: 'success' | 'failure' | 'error';
  message: string;
  drawing?: Drawing;  
  error?: string;     
}

export const updateDrawingTitle = async (drawingId: string, newTitle: string, uid: string): Promise<UpdateDrawingTitleResponse> => {
  try {
    const response = await axios.put(
      `${backendUrl}/update_drawing_title`,
      {
        uid: uid,
        drawing_id: drawingId,
        new_title: newTitle
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        drawing: response.data.drawing,  // The updated drawing if successful
      };
    }

    return {
      status: 'failure',
      message: 'Unexpected response from the server.',
    };
  } catch (error: unknown) {
    // Narrow the type of 'error' to AxiosError
    if (axios.isAxiosError(error)) {
      return {
        status: 'failure',
        message: error.response?.data?.detail || 'An error occurred while updating the title.',
        error: error.message,
      };
    } else {
      // Handle non-Axios errors
      return {
        status: 'error',
        message: 'An unexpected error occurred.',
        error: (error as Error).message || 'Unknown error',
      };
    }
  }
};


interface DrawingSessionResponse {
  status: DrawingStatus;
  message: string;
  session?: CollabDrawing ;  
}

// Function to create or retrieve a drawing session
export const createOrGetDrawingSession = async (room_id: string, user: { uid: string; name: string; email: string }, title: string = "Untitled Drawing"): Promise<DrawingSessionResponse> => {
  try {
    const response = await axios.post(`${backendUrl}/create_or_get_session`, {
      room_id: room_id,
      user,
      title,
    });

    // Assuming the backend returns a status and session data
    const responseData = response.data;

    if (responseData.status === DrawingStatus.Success || responseData.status === DrawingStatus.Exists) {
      console.info('Session created or retrieved:', responseData.session);
      return {
        status: responseData.status,
        message: "Session created or retrieved successfully.",
        session: responseData.session,
      };
    } else {
      console.error('Failed to create or retrieve session:', responseData.message);
      return {
        status: DrawingStatus.Failure,
        message: "Failed to create or retrieve session.",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      return {
        status: DrawingStatus.Error,
        message: `Network error: ${error.message}`,
      };
    }

    console.error('Unexpected error:', error);
    return {
      status: DrawingStatus.Error,
      message: "An unexpected error occurred.",
    };
  }
};