import { createSlice } from "@reduxjs/toolkit";

export interface sidebarControlTypes {
  isSidebarOpen: boolean;
}

const initialState: sidebarControlTypes = {
  isSidebarOpen: true,
};

const SliderControlSlice = createSlice({
  name: "SliderControlSlice",
  initialState,
  reducers: {
    setShowSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});
export default SliderControlSlice;
export const { setShowSidebar } = SliderControlSlice.actions;
