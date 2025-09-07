export interface ChatMessage {
  id: number;
  text?: string;
  imageUrl?: string;
  sender: "user" | "bot";
}

export interface Conversation {
  id: number;
  title: string;
  messages: ChatMessage[];
}

export const dummyConversations: Conversation[] = [
  {
    id: 1,
    title: "Formal greetings",
    messages: [
      { id: 1, sender: "user", text: "Hello AI!" },
      { id: 2, sender: "bot", text: "Hey! How can I help you today?" },
    ],
  },
  {
    id: 2,
    title: "Telling a joke",
    messages: [
      { id: 3, sender: "user", text: "Tell me a joke." },
      {
        id: 4,
        sender: "bot",
        text: "Why don’t skeletons fight each other? They don’t have the guts.",
      },
    ],
  },
  {
    id: 3,
    title: "Weather query",
    messages: [
      { id: 5, sender: "user", text: "What’s the weather like?" },
      {
        id: 6,
        sender: "bot",
        text: "I don’t have real-time weather, but it’s always sunny in Cerebra land ☀️",
      },
    ],
  },
  {
    id: 4,
    title: "Sending AI images",
    messages: [
      { id: 7, sender: "user", text: "Send me an image." },
      {
        id: 8,
        sender: "bot",
        imageUrl:
          "https://imgs.search.brave.com/PqNNP6U5pJn2aJnk7qpnF1O1AOMmb08zyulzfTDmTyM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aGV0/cnVzdGVkLnRlYW0v/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MDgvYWlfYWR2YW5j/ZV9pbWFnZS0xLmpw/Zw",
      },
    ],
  },
  {
    id: 5,
    title: "Recursion explaination",
    messages: [
      { id: 9, sender: "user", text: "Explain recursion." },
      {
        id: 10,
        sender: "bot",
        text: "Recursion is a function calling itself until a base case is reached.",
      },
    ],
  },
];
