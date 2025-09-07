import { configureStore } from "@reduxjs/toolkit";
import SliderControlReducer from "./SliderControlSlice";
import ModelSelectorReducer from "./ModelSelectorSlice";
import conversationReducer from "./ConversationSlice";

const Store = configureStore({
  reducer: {
    SliderControlReducer: SliderControlReducer.reducer,
    ModelSelectorReducer: ModelSelectorReducer.reducer,
    ConversationReducer: conversationReducer.reducer,
  },
});
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
