export interface ChatMessage {
  id: number;
  text?: string;
  imageUrl?: string;
  sender: "user" | "ai";
  timestamp?: number;
}

export interface Conversation {
  id: number;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export let dummyConversations: Conversation[] = [];

export const initializeConversations = (): Conversation[] => {
  if (dummyConversations.length === 0) {
    const now = Date.now();
    dummyConversations = [
      {
        id: 1,
        title: "Welcome Chat",
        messages: [
          {
            id: 1,
            text: "Hello! I'm Cerebra, your AI assistant powered by Google Gemini. How can I help you today?",
            sender: "ai",
            timestamp: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
  return dummyConversations;
};

export const addNewConversation = (): Conversation => {
  const now = Date.now();
  const newConversation: Conversation = {
    id: now,
    title: `New Chat ${dummyConversations.length + 1}`,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  dummyConversations.unshift(newConversation);
  return newConversation;
};

export const updateConversation = (
  id: number,
  messages: ChatMessage[],
  title?: string
): void => {
  const conversation = dummyConversations.find((conv) => conv.id === id);
  if (conversation) {
    conversation.messages = messages;
    conversation.updatedAt = Date.now();
    if (title && messages.length <= 2) {
      conversation.title = title;
    }
  }
};
