import axios from 'axios';
import { DrawingData } from '@/types/CanvasTypes';
import { SaveDrawingStatus } from '@/types/enums/SaveDrawingStatus';
import { CollabDrawingData } from '@/types/CollabCanvas';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export interface UserData {
  uid: string;
  name: string;
  email: string;
  drawings: DrawingData[]; 
  collab_drawings: CollabDrawingData[]
}

// Centralized error handling function for API calls
const handleApiError = (error: any): SaveDrawingStatus => {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        console.error("User not found:", error.response.data.detail);
        return SaveDrawingStatus.USER_NOT_FOUND;

      case 409:
        console.info("Drawing already exists:", error.response.data.detail);
        return SaveDrawingStatus.DRAWING_EXISTS;

      case 500:
        console.error("Server error:", error.response.data.detail);
        return SaveDrawingStatus.ERROR;

      default:
        console.error("Unexpected error:", error.response.data);
        return SaveDrawingStatus.ERROR;
    }
  }

  // If no response (e.g., network error), return generic error
  console.error("Network error or no response:", error.message);
  return SaveDrawingStatus.ERROR;
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/get-user-data?uid=${uid}`);
    
    return response.data.user ?? null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; 
  }
};

export const saveUser = async (user: UserData): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/save-user-data`, user);
    console.log("User Saved Successfully", response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const saveDrawingInUser = async (
  uid: string,
  drawingData: DrawingData
): Promise<SaveDrawingStatus> => {
  try {
    await axios.put(`${BACKEND_URL}/update-user-data`, {
      uid,
      drawing_data: drawingData,
    });

    // If no exception, assume success as per backend logic
    return SaveDrawingStatus.SUCCESS;

  } catch (error: any) {
    return handleApiError(error);
  }
};

export const createCollabSession = async (
  uid: string,
  collabDrawingData: CollabDrawingData
): Promise<SaveDrawingStatus> => {
  try {
    await axios.put(`${BACKEND_URL}/create-collab-session`, {
      uid,
      collab_drawing_data: collabDrawingData,
    });

    // If no exception, assume success as per backend logic
    return SaveDrawingStatus.SUCCESS;

  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updateCollabThumbnail = async (
  uid: string, 
  roomId: string, 
  imageUrl: string
): Promise<SaveDrawingStatus> => {
  try {
    await axios.put(`${BACKEND_URL}/update-collab-thumbnail`, {
      uid,
      room_id: roomId,
      image_url: imageUrl,
    });

    console.log(SaveDrawingStatus.SUCCESS)
    return SaveDrawingStatus.SUCCESS;
    
  } catch (error: any) {
    return handleApiError(error);
  }
};