import { GetProjectWithUpdatesQuery } from "@/__generated__/graphql";
import type { RootState } from "@/app/store";
import { random } from "@ctrl/tinycolor";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Profile = {
  username: string;
  colour: string;
};

type GlobalState = {
  username?: string;
  colour: string;
  project?: GetProjectWithUpdatesQuery["project"];
};

const initialState: GlobalState = {
  username: undefined,
  colour: random().toHexString(),
  project: undefined,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    projectSet: (
      state,
      action: PayloadAction<GetProjectWithUpdatesQuery["project"]>
    ) => {
      state.project = action.payload;
    },
    userSet: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { projectSet, userSet } = globalSlice.actions;

const globalReducer = globalSlice.reducer;
export default globalReducer;

export const selectProject = (state: RootState) => state.global.project;
export const selectUsername = (state: RootState) => state.global.username;
export const selectColour = (state: RootState) => state.global.colour;
