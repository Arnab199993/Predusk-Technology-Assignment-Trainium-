import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Moon,
  Paperclip,
  Send,
  Sun,
  X,
} from "lucide-react";
import { CustomSize } from "../../Constant/Constant";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Models from "../Models/Models";
import { useAppDispatch, useAppSelector } from "../../Hooks/Hooks";
import { dummyModels, type dummyModelsType } from "../../Core/Models";
import { type ChatMessage } from "../../Core/Conversation";
import conversationSlice from "../../Redux/ConversationSlice";
import { GoogleGenAI } from "@google/genai";

const Message = () => {
  const [showModel, setShowModel] = useState(false);
  const [model, setModel] = useState<dummyModelsType | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKeyDetails = import.meta.env.VITE_GEMINI_API_KEY;

  const ai = new GoogleGenAI({
    apiKey: apiKeyDetails,
  });

  const geminiApi = {
    async sendMessage(
      messages: ChatMessage[],
      newMessage: ChatMessage,
      modelNo: string
    ): Promise<string> {
      try {
        const contents = [
          ...messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text || "" }],
          })),
          {
            role: "user",
            parts: [{ text: newMessage.text || "" }],
          },
        ].filter((msg) => msg.parts[0].text.trim());

        const modelName =
          modelNo === "gemini-pro-vision"
            ? "gemini-1.5-flash"
            : "gemini-2.0-flash";

        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40,
          },
        });

        if (response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (candidate?.content?.parts && candidate.content.parts.length > 0) {
            const text = candidate.content.parts[0].text;
            if (text) {
              return text;
            }
          }
        }

        console.warn("Unexpected response structure:", response);
        throw new Error("Invalid response format from Gemini API");
      } catch (error) {
        console.error("Error calling Gemini API:", error);

        if (error instanceof Error) {
          if (
            error.message.includes("API_KEY_INVALID") ||
            error.message.includes("401")
          ) {
            throw new Error(
              "Invalid API key. Please check your Gemini API key."
            );
          } else if (error.message.includes("QUOTA_EXCEEDED")) {
            throw new Error(
              "API quota exceeded. Please check your usage limits."
            );
          } else if (error.message.includes("RATE_LIMIT")) {
            throw new Error("Rate limit exceeded. Please try again later.");
          } else if (error.message.includes("SAFETY")) {
            throw new Error(
              "The response was blocked for safety reasons. Please try a different prompt."
            );
          }
        }

        throw new Error(
          "Failed to get response from Gemini API. Please try again."
        );
      }
    },
  };

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.ConversationReducer.loading);
  const error = useAppSelector((state) => state.ConversationReducer.error);
  const conversations = useAppSelector(
    (state) => state.ConversationReducer.conversations
  );

  const isOpen = useAppSelector(
    (state) => state.SliderControlReducer.isSidebarOpen
  );
  const selectedModel = useAppSelector(
    (state) => state.ModelSelectorReducer.selectedModal
  );
  const selectedConversationId = useAppSelector(
    (state) => state.ConversationReducer.selectedId
  );

  const conversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const [messages, setMessages] = useState<ChatMessage[]>(
    conversation?.messages || []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const filterModel = dummyModels?.find(
      (model: dummyModelsType) => model.id === selectedModel
    );
    setModel(filterModel || dummyModels[0]);
  }, [selectedModel]);

  useEffect(() => {
    setMessages(conversation?.messages || []);
  }, [conversation]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (
      (!messageInput.trim() && !previewImage) ||
      isSending ||
      !selectedConversationId
    )
      return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: messageInput.trim() || undefined,
      imageUrl: previewImage || undefined,
      sender: "user",
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessageInput("");
    setPreviewImage(null);
    setIsSending(true);

    try {
      dispatch(
        conversationSlice.actions.updateConversationMessages({
          id: selectedConversationId,
          messages: updatedMessages,
        })
      );

      const aiResponse = await geminiApi.sendMessage(
        messages,
        newMessage,
        model?.modelNo || "gemini-pro"
      );

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const firstMessageText = finalMessages[0]?.text?.substring(0, 30) + "...";
      dispatch(
        conversationSlice.actions.updateConversationMessages({
          id: selectedConversationId,
          messages: finalMessages,
          title: finalMessages.length <= 2 ? firstMessageText : undefined,
        })
      );
    } catch (error) {
      console.error("Failed to send message:", error);

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: error instanceof Error ? error.message : "Something went wrong.",
        sender: "ai",
        timestamp: Date.now(),
      };

      const errorMessages = [...updatedMessages, errorMessage];
      setMessages(errorMessages);

      dispatch(
        conversationSlice.actions.updateConversationMessages({
          id: selectedConversationId,
          messages: errorMessages,
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (message: ChatMessage) => {
    if (message.imageUrl) {
      const link = document.createElement("a");
      link.href = message.imageUrl;
      link.download = `image-${message.id}.png`;
      link.click();
      return;
    }
    const blob = new Blob([JSON.stringify(message, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `message-${message.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (loading) {
    return (
      <div className="dark:bg-gray-800 dark:text-white w-full h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <span className="ml-2">Loading conversation...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-gray-800 dark:text-white w-full h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>Something went wrong: {error}</p>
          <button
            onClick={() => dispatch(conversationSlice.actions.clearError())}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ padding: CustomSize.padding }}
      className="w-full h-screen flex flex-col dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <div style={{ marginLeft: !isOpen ? "10rem" : "" }}>
          <div className="flex items-center text-gray-600 leading-0">
            <div
              onClick={() => setShowModel((prev) => !prev)}
              className="cursor-pointer flex items-center hover:bg-gray-100 p-2 rounded-lg dark:text-white hover:dark:text-black"
            >
              <span className="text-md">{model?.name || "Gemini Pro"}</span>
              <span className="mt-[0.2rem]">
                <ChevronDown size={18} />
              </span>
            </div>
          </div>
          {showModel && (
            <div className="absolute mt-2 cursor-pointer z-10">
              <Models />
            </div>
          )}
        </div>

        <div
          onClick={() => setIsDark(!isDark)}
          className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          {isDark ? (
            <Moon className="text-blue-600" size={20} />
          ) : (
            <Sun className="text-yellow-500" size={20} />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full rounded-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user"
                  ? "items-end"
                  : "items-start dark:text-white"
              }`}
            >
              <div
                className={`p-4 rounded-2xl text-sm max-w-[70%] break-words ${
                  msg.sender === "user"
                    ? "bg-blue-50 dark:bg-blue-900"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                {msg.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded"
                      className="max-w-full rounded-lg max-h-64 object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Image analysis requires Gemini Pro Vision model
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleDownload(msg)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Download message"
                >
                  <Download size={16} />
                </button>
                {msg.text && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text!)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex flex-col items-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl text-sm max-w-[70%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="border border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden">
            {previewImage && (
              <div className="p-3 bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500">
                <div className="flex items-center gap-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-500 dark:text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Image upload is available, but image analysis requires Gemini
                  Pro Vision model
                </p>
              </div>
            )}
            <div className="relative bg-white dark:bg-gray-600">
              <textarea
                value={messageInput}
                onChange={handleInputChange}
                className="w-full p-3 focus:outline-none resize-none transition-all duration-300 pr-20 bg-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                placeholder="Message Cerebra with Gemini AI..."
                disabled={isSending}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                  disabled={isSending}
                  title="Attach image"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 transition-colors"
                  disabled={
                    isSending || (!messageInput.trim() && !previewImage)
                  }
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            disabled={isSending}
          />
        </form>
      </div>
    </div>
  );
};

export default Message;
