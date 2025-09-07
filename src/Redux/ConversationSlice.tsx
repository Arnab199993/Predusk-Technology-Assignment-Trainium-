import { createSlice } from "@reduxjs/toolkit";

interface ConversationState {
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  selectedId: 1,
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: "conversationSlice",
  initialState,
  reducers: {
    select(state, action) {
      state.selectedId = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetState(state) {
      state.loading = false;
      state.error = null;
    },
  },
});

export const { select, setLoading, setError, resetState } =
  conversationSlice.actions;

export default conversationSlice;
