import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Paperclip,
  Send,
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
import { useAppSelector } from "../../Hooks/Hooks";
import { dummyModels, type dummyModelsType } from "../../Core/Models";
import { dummyConversations, type ChatMessage } from "../../Core/Conversation";

const Message = () => {
  const [showModel, setShowModel] = useState(false);
  const [model, setModel] = useState<dummyModelsType | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loading = useAppSelector((state) => state.ConversationReducer.loading);
  const error = useAppSelector((state) => state.ConversationReducer.error);

  const isOpen = useAppSelector(
    (state) => state.SliderControlReducer.isSidebarOpen
  );
  const selectedModel = useAppSelector(
    (state) => state.ModelSelectorReducer.selectedModal
  );
  const selectedConversationId = useAppSelector(
    (state) => state.ConversationReducer.selectedId
  );

  const conversation = dummyConversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const [messages, setMessages] = useState<ChatMessage[]>(
    conversation?.messages || []
  );

  useEffect(() => {
    const filterModel = dummyModels?.find(
      (model: dummyModelsType) => model.id === selectedModel
    );
    setModel(filterModel || null);
  }, [selectedModel]);

  useEffect(() => {
    setMessages(conversation?.messages || []);
  }, [conversation]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !previewImage) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: messageInput.trim() || undefined,
      imageUrl: previewImage || undefined,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
    setPreviewImage(null);
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return <div className="m-auto">Loading...</div>;
  }
  if (error) {
    return <div className="m-auto">Something went wrong</div>;
  }

  return (
    <div
      style={{ padding: CustomSize.padding }}
      className="w-full h-screen flex flex-col"
    >
      <div style={{ marginLeft: !isOpen ? "10rem" : "" }}>
        <div className="flex items-center text-gray-600 leading-0">
          <div
            onClick={() => setShowModel((prev) => !prev)}
            className="cursor-pointer flex items-center hover:bg-gray-100 p-2 rounded-lg"
          >
            <span className="text-md ">
              {model?.name || dummyModels[0]?.name}
            </span>
            <span className="mt-[0.2rem]">
              <ChevronDown size={18} />
            </span>
          </div>
        </div>
        {showModel && (
          <div className="absolute mt-2 cursor-pointer">
            <Models />
          </div>
        )}
      </div>

      <div className="text-center mb-4">{`You are using ${
        model?.name || dummyModels[0]?.name
      } now`}</div>
      <div>
        <h6 className="flex justify-center">
          {conversation?.title || "No Conversation"}
        </h6>
      </div>
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full rounded-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`bg-blue-50 p-3 rounded-2xl text-sm max-w-[60%] break-words`}
                >
                  {msg.text && <p>{msg.text}</p>}
                  {msg.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded"
                        className="max-w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleDownload(msg)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <Download size={16} />
                  </button>
                  {msg.text && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text!)}
                      className="p-1 rounded-full hover:bg-gray-200"
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
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="bg-white px-4 py-3">
          <div className="border border-gray-300 rounded-2xl overflow-hidden">
            {previewImage && (
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            <div className="relative">
              <textarea
                value={messageInput}
                onChange={handleInputChange}
                className="w-full p-3 focus:outline-none resize-none transition-all duration-300 pr-20"
                rows={3}
                placeholder="Message Cerebra..."
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
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
          />
        </form>
      </div>
    </div>
  );
};

export default Message;
