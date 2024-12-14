import { RootState } from "@/store/store"; 

export const selectCollabSession = (state: RootState) => state.collabSession;

export const selectCreatedBy = (state: RootState) => state.collabSession.createdBy;
export const selectRoomId = (state: RootState) => state.collabSession.roomId;
export const selectSessionName = (state: RootState) => state.collabSession.sessionName;
