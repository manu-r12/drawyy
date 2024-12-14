import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardState/boardsSlice"
import collabReducer from "./collabSessionState/slice"

const store = configureStore({
  reducer: {
    board: boardReducer,
    collabSession: collabReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
