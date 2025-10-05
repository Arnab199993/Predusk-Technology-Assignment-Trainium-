import { Plus, MessageSquare, Settings } from "lucide-react";
import cerebra from "../../assets/cerebra.png";
import sidebar from "../../assets/sidebar.png";
import { useAppDispatch, useAppSelector } from "../../Hooks/Hooks";
import SliderControlSlice from "../../Redux/SliderControlSlice";
import conversationSlice from "../../Redux/ConversationSlice";
import { useState, useEffect } from "react";
import {
  initializeConversations,
  addNewConversation,
} from "../../Core/Conversation";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isOpen = useAppSelector(
    (state) => state.SliderControlReducer.isSidebarOpen
  );
  const conversations = useAppSelector(
    (state) => state.ConversationReducer.conversations
  );
  const selectedConversationId = useAppSelector(
    (state) => state.ConversationReducer.selectedId
  );
  const loading = useAppSelector((state) => state.ConversationReducer.loading);

  useEffect(() => {
    const initialConversations = initializeConversations();
    dispatch(
      conversationSlice.actions.initializeConversations(initialConversations)
    );

    if (initialConversations.length > 0 && !selectedConversationId) {
      setSelectedId(initialConversations[0].id);
      dispatch(
        conversationSlice.actions.selectConversation(initialConversations[0].id)
      );
    }
  }, [dispatch, selectedConversationId]);

  const handleSidebarOpener = () => {
    dispatch(SliderControlSlice.actions.setShowSidebar(!isOpen));
  };

  const handleConversationClick = async (id: number) => {
    if (loading) return;

    setSelectedId(id);
    dispatch(conversationSlice.actions.setLoading(true));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(conversationSlice.actions.selectConversation(id));
    } catch (error) {
      dispatch(
        conversationSlice.actions.setError("Failed to load conversation")
      );
    } finally {
      dispatch(conversationSlice.actions.setLoading(false));
    }
  };

  const handleNewChat = () => {
    const newConversation = addNewConversation();
    dispatch(conversationSlice.actions.addNewConversation(newConversation));
    setSelectedId(newConversation.id);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <>
      <div className="dark:border-r-white border-r border-transparent bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div
          className={`${
            isOpen ? "w-64" : "w-0"
          } h-screen flex flex-col transition-all duration-300 overflow-hidden dark:bg-gray-800`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 dark:border-gray-600 shrink-0">
            <div className="flex items-center">
              <div className="h-10 w-10">
                <img className="h-full" src={cerebra} alt="logo" />
              </div>
              <div className="ml-1 text-[#3B82F6]">
                <h1
                  className={`${isOpen ? "block" : "hidden"} text-lg font-bold`}
                >
                  Cerebra
                </h1>
              </div>
            </div>
            <div
              onClick={handleSidebarOpener}
              className="h-9 w-9 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer p-2 rounded-full transition-colors"
            >
              <img className="h-full" src={sidebar} alt="Toggle sidebar" />
            </div>
          </div>

          <div className="flex-1 flex flex-col px-3 py-4 overflow-y-auto scrollbar-hide">
            <button
              className="flex items-center gap-3 w-full px-3 py-2 mb-3 text-sm rounded-lg bg-white dark:bg-gray-700 hover:shadow-lg shrink-0 cursor-pointer transition-all duration-200 dark:text-white"
              onClick={handleNewChat}
              disabled={loading}
            >
              <Plus size={18} />
              <span>{isOpen && "New Chat"}</span>
            </button>

            <div className="space-y-1">
              <p
                className={`${
                  isOpen ? "block" : "hidden"
                } text-xs text-gray-400 dark:text-gray-500 mb-2 px-2`}
              >
                Recent Conversations
              </p>
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  onClick={() => handleConversationClick(convo.id)}
                  className={`flex items-center justify-between group px-2 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedId === convo.id
                      ? "bg-blue-100 dark:bg-blue-900 text-[#3B82F6]"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <MessageSquare size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{convo.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {convo.messages.length > 0
                          ? `${convo.messages.length} messages • ${formatTime(
                              convo.updatedAt
                            )}`
                          : `Created ${formatTime(convo.createdAt)}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {conversations.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare
                    size={32}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs">Start a new chat to begin</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-3 py-4 border-t border-gray-400 dark:border-gray-600 shrink-0">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors dark:text-white">
              <Settings size={18} />
              {isOpen && "Settings"}
            </div>
          </div>
        </div>

        {!isOpen && (
          <div className="fixed top-3 left-3 flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded-xl shadow-md dark:shadow-gray-900">
            <div
              onClick={handleSidebarOpener}
              className="h-10 w-10 cursor-pointer"
            >
              <img className="h-full" src={cerebra} alt="logo" />
            </div>

            <div
              onClick={handleSidebarOpener}
              className="h-9 w-9 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer p-2 rounded-full transition-colors"
            >
              <img className="h-full" src={sidebar} alt="Toggle sidebar" />
            </div>

            <button
              onClick={handleNewChat}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              title="New Chat"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
