import { RootState } from "@/store/store"; 

export const selectBoard = (state: RootState) => state.board;
export const selectBoardId = (state: RootState) => state.board.id;
export const selectBoardTitle = (state: RootState) => state.board.title;
