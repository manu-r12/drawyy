import { DrawElement } from "./CanvasTypes"

export interface CollabDrawingData {
    room_id: string
    thumbnail: string
    created_at: string 
}

// Reference Types
// It was for testing.....
// interface CollabDrawing {
//     _id: ObjectId;
//     drawingId: string;
//     title: string;e
//     elements: DrawElement[];
//     usersConnected: {
//       userId: string;
//       userName: string;
//       connectedAt: Date;
//     }[];
//     dateCreated: Date;
//     lastUpdated: Date;
//     createdBy: string;
//   }
  


export interface CollabDrawing {
    room_id: string
    session_name: string 
    elements: DrawElement[]
    users_connected: CollabUser[]
    created_by: string;
}