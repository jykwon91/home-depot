import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { AppState } from "../types/app";

// Define the initial state using that type
const initialState: AppState = {
  open: true,
  openModal: false,
  status: "",
  error: undefined,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOpen: (state) => {
      state.open = !state.open;
    },
    setOpenModal: (state) => {
      state.openModal = !state.openModal;
    },
  },
});

export const { setOpen, setOpenModal } = appSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectOpen = (state: RootState) => state.app.open;
export const selectOpenModal = (state: RootState) => state.app.openModal;

export default appSlice.reducer;
