import fileActionReducer from "@/features/file-action.slice";
import globalReducer from "@/features/global.slice";
import openedFilesReducer from "@/features/opened-files.slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    openedFiles: openedFilesReducer,
    global: globalReducer,
    fileAction: fileActionReducer,
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
