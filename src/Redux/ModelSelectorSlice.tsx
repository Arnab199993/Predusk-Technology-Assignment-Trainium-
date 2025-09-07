import { createSlice } from "@reduxjs/toolkit";

export interface ModelSelectorTypes {
  selectedModal: string;
}

const initialState: ModelSelectorTypes = {
  selectedModal: "",
};

const ModelSelectorSlice = createSlice({
  name: "ModelSelectorSlice",
  initialState,
  reducers: {
    setSelectedModal: (state, action) => {
      state.selectedModal = action.payload;
    },
  },
});
export default ModelSelectorSlice;
export const { setSelectedModal } = ModelSelectorSlice.actions;
