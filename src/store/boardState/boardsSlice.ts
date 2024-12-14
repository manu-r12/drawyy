// store/boardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BoardState {
  id: string | null;
  title: string | null;
}

const initialState: BoardState = {
  id: null,
  title: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardState: (state, action: PayloadAction<BoardState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
    },
    clearBoardState: (state) => {
      state.id = null;
      state.title = null;
    },
  },
});

export const { setBoardState, clearBoardState } = boardSlice.actions;
export default boardSlice.reducer;
