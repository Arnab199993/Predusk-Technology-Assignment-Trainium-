import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Conversation, ChatMessage } from "../Core/Conversation";

interface ConversationState {
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  conversations: Conversation[];
}

const initialState: ConversationState = {
  selectedId: null,
  loading: false,
  error: null,
  conversations: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    initializeConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    selectConversation: (state, action: PayloadAction<number>) => {
      state.selectedId = action.payload;
      state.error = null;
    },
    addNewConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
      state.selectedId = action.payload.id;
    },
    updateConversationMessages: (
      state,
      action: PayloadAction<{
        id: number;
        messages: ChatMessage[];
        title?: string;
      }>
    ) => {
      const { id, messages, title } = action.payload;
      const conversation = state.conversations.find((conv) => conv.id === id);
      if (conversation) {
        conversation.messages = messages;
        conversation.updatedAt = Date.now();
        if (title) {
          conversation.title = title;
        }
      }
    },
    updateConversationTitle: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      const { id, title } = action.payload;
      const conversation = state.conversations.find((conv) => conv.id === id);
      if (conversation) {
        conversation.title = title;
        conversation.updatedAt = Date.now();
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { actions, reducer } = conversationSlice;
export default conversationSlice;
