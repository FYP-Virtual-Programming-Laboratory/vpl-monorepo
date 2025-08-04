import type { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Version } from "../__generated__/graphql";

export type FileActionState = {
  deleteFile: {
    openDialog: boolean;
    fileId?: string;
  };
  newFile: {
    path: string;
    openDialog: boolean;
  };
  revertFile: {
    version?: Version;
    openDialog: boolean;
  };
};

const initialState: FileActionState = {
  deleteFile: {
    openDialog: false,
    fileId: undefined,
  },
  newFile: {
    path: "",
    openDialog: false,
  },
  revertFile: {
    version: undefined,
    openDialog: false,
  },
};

const globalSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    fileDeletionIntiated: (state, action: PayloadAction<string>) => {
      state.deleteFile.fileId = action.payload;
      state.deleteFile.openDialog = true;
    },
    fileDeletionFinshedOrCancelled: (state) => {
      state.deleteFile.openDialog = false;
    },
    newFileDialogOpened: (state, action: PayloadAction<string | undefined>) => {
      state.newFile.openDialog = true;
      state.newFile.path = action.payload ?? "";
    },
    newFilePathChanged: (state, action: PayloadAction<string>) => {
      state.newFile.path = action.payload;
    },
    newFilePathReset: (state) => {
      state.newFile.path = "";
    },
    newFileDialogClosed: (state) => {
      state.newFile.openDialog = false;
    },
    revertFileDialogOpened: (state, action: PayloadAction<Version>) => {
      state.revertFile.version = action.payload;
      state.revertFile.openDialog = true;
    },
    revertFileDialogClosed: (state) => {
      state.revertFile.openDialog = false;
    },
  },
});

export const {
  fileDeletionFinshedOrCancelled,
  fileDeletionIntiated,
  newFileDialogOpened,
  newFilePathChanged,
  newFilePathReset,
  newFileDialogClosed,
  revertFileDialogOpened,
  revertFileDialogClosed,
} = globalSlice.actions;

const fileActionReducer = globalSlice.reducer;
export default fileActionReducer;

export const selectDeleteFile = (state: RootState) =>
  state.fileAction.deleteFile;
export const selectNewFile = (state: RootState) => state.fileAction.newFile;
export const selectRevertFileState = (state: RootState) =>
  state.fileAction.revertFile;
