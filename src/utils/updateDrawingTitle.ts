import { toast } from 'react-toastify'; 
import { updateDrawingTitle } from '@/services/drawingService'; 

export const renameDrawingTitle = async (drawingId: string, newTitle: string, uid: string) => {
  try {
    const response = await updateDrawingTitle(drawingId, newTitle, uid);

    if (response.status === 'success') {
      toast.success(`Drawing title updated successfully!`, {
        position: "bottom-right",
    });
      console.log(response.drawing);
    } else if (response.status === 'failure') {
      toast.error(`Failed to update drawing title: ${response.message}`, {
        position: "bottom-right",
    });
    } else {
      toast.error('An unexpected error occurred.', {
        position: "bottom-right",
    });
    }
  } catch (error) {
    // Handle unexpected errors
    toast.error(`An unexpected error occurred: ${(error as Error).message}`, {
        position: "bottom-right",
    });
};
}