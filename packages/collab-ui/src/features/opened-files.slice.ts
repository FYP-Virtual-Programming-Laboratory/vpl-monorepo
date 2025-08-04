import type { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type VersionNode = {
  id: string;
  fileId: string;
  name: string;
  path: string;
  createdAt: string;
  committedBy: string;
  content: string;
};

type OpenedFilesState = {
  /** The index of the active file in the {@link OpenedFilesState.files files} array, or null if no file is active. */
  activeFileIdx: number | null;
  /** An array of ids of files that are opened. */
  files: string[];
  versions: Record<string, VersionNode>;
};

const initialState: OpenedFilesState = {
  activeFileIdx: null,
  files: [],
  versions: {},
};

const openedFilesSlice = createSlice({
  name: "openedFiles",
  initialState,
  reducers: {
    fileOpened: (state, action: PayloadAction<{ fileId: string }>) => {
      const idx = state.files.indexOf(action.payload.fileId);

      if (idx !== -1) {
        // File is already open
        state.activeFileIdx = idx;
        return;
      }

      state.files.push(action.payload.fileId);
      state.activeFileIdx = state.files.length - 1;
    },
    fileClosed: (state, action: PayloadAction<{ index: number }>) => {
      if (
        action.payload.index < 0 ||
        action.payload.index >= state.files.length
      ) {
        // File is not open
        return;
      }

      const fileId = state.files[action.payload.index];
      state.files = state.files.filter((id) => id !== fileId);

      if (fileId.startsWith("version-")) {
        // Remove version
        delete state.versions[fileId];
      }

      if (state.activeFileIdx === action.payload.index) {
        if (state.files.length === 0) {
          state.activeFileIdx = null;
        } else if (action.payload.index === state.files.length) {
          state.activeFileIdx = Math.max(0, action.payload.index - 1);
        }
      } else if (
        state.activeFileIdx &&
        state.activeFileIdx >= state.files.length
      ) {
        state.activeFileIdx = state.files.length - 1;
      }
    },
    fileActivated: (state, action: PayloadAction<{ index: number }>) => {
      if (
        action.payload.index < 0 ||
        action.payload.index >= state.files.length
      ) {
        // File is not open
        return;
      }

      state.activeFileIdx = action.payload.index;
    },
    versionOpened: (state, action: PayloadAction<VersionNode>) => {
      const id = `version-${action.payload.id}-${action.payload.fileId}`;
      const idx = state.files.indexOf(id);

      if (idx !== -1) {
        // File is already open
        state.activeFileIdx = idx;
        return;
      }

      const payload = action.payload;
      payload.id = id;
      state.versions[id] = payload;

      state.files.push(id);
      state.activeFileIdx = state.files.length - 1;
    },
  },
});

export const { fileOpened, fileActivated, fileClosed, versionOpened } =
  openedFilesSlice.actions;

const openedFilesReducer = openedFilesSlice.reducer;
export default openedFilesReducer;

export const selectOpenedFiles = (state: RootState) => state.openedFiles.files;
export const selectActiveFileIdx = (state: RootState) =>
  state.openedFiles.activeFileIdx;
export const selectActiveFileId = (state: RootState) =>
  state.openedFiles.activeFileIdx !== null
    ? state.openedFiles.files[state.openedFiles.activeFileIdx]
    : null;
export const selectVersions = (state: RootState) => state.openedFiles.versions;
