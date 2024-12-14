import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CollabSessionState {
  createdBy: string;
  roomId: string;
  sessionName: string;
}

const initialState: CollabSessionState = {
  createdBy: '',
  roomId: '',
  sessionName: ''
};

const collabSessionSlice = createSlice({
  name: 'collabSession',
  initialState,
  reducers: {
    setCollabSessionData: (
      state,
      action: PayloadAction<CollabSessionState>
    ) => {
      state.createdBy = action.payload.createdBy;
      state.roomId = action.payload.roomId;
      state.sessionName = action.payload.sessionName;
    },
    resetCollabSessionData: (state) => {
      state.createdBy = '';
      state.roomId = '';
      state.sessionName = '';
    },
  },
});

export const { setCollabSessionData, resetCollabSessionData } = collabSessionSlice.actions;
export default collabSessionSlice.reducer;
