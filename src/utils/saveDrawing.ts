import {checkIfDrawingExists, saveDrawingToDatabase} from "@/services/drawingService";
import {toast} from "react-toastify";
import {uploadThumbnail} from "@/services/uploadThumbnail";
import {saveDrawingInUser} from "@/services/userService";
import {SaveDrawingStatus} from "@/types/enums/SaveDrawingStatus";
import {Drawing} from "@/types/CanvasTypes";
import React from "react";

export const saveDrawing =
    async (drawing: Drawing,
           uid: string,
           canvasRef: React.RefObject<HTMLCanvasElement>,
           boardTitle: string
    ) => {

    try {

        // Save drawing to the database
        const dbResponse = await saveDrawingToDatabase(drawing);

        if (dbResponse.status === 'exists') {
            toast.info("Drawing already saved, no need to re-upload.", {
                position: "top-right",
            });
            return;
        } else if (dbResponse.status === "failure" || dbResponse.status === "error"){
            toast.error("Something Went Wrong :(", {
                position: "top-right",
            });
            return;
        }

        console.log("Uploading Thumbnail.....")

        const drawingExists = await checkIfDrawingExists(uid, drawing.drawingId);

        if (drawingExists) {
            toast.info("Drawing already exists, no need to re-upload.", { position: "top-right" });
            return;
        }

        const thumbnailRef = await uploadThumbnail(canvasRef)

        if (!thumbnailRef){
            toast.error("Failed to upload drawing image. Please try again later.", {
                position: "top-right",
            });
            return
        }

        console.log("Uploading Drawing Data to User.....")
        const userResponseStatus = await saveDrawingInUser(uid, {
            id: drawing.drawingId,
            title: boardTitle,
            createdAt: new Date().toISOString(),
            thumbnail: thumbnailRef
        });

        // Handle responses and show appropriate toast messages
        switch (userResponseStatus) {
            case SaveDrawingStatus.SUCCESS:
                toast.success("Drawing saved successfully!", {
                    position: "bottom-right",
                });
                break;

            case SaveDrawingStatus.DRAWING_EXISTS:
                toast.info("Drawing already exists in your saved drawings.", {
                    position: "bottom-right",
                });
                break;

            case SaveDrawingStatus.USER_NOT_FOUND:
                toast.error("User not found. Please log in again.", {
                    position: "bottom-right",
                });
                break;

            case SaveDrawingStatus.ERROR:
            default:
                toast.error("Failed to save drawing. Please try again later.", {
                    position: "top-right",
                });
                break;
        }
    } catch (error) {
        console.error("Error saving drawing:", error);
        toast.error("An unexpected error occurred. Please try again.", {
            position: "top-right",
        });
    }
};