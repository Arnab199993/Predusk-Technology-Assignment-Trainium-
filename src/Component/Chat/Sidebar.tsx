import { Plus, MessageSquare, Settings } from "lucide-react";
import cerebra from "../../assets/cerebra.png";
import sidebar from "../../assets/sidebar.png";
import { useAppDispatch, useAppSelector } from "../../Hooks/Hooks";
import SliderControlSlice from "../../Redux/SliderControlSlice";
import { dummyConversations } from "../../Core/Conversation";
import conversationSlice from "../../Redux/ConversationSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<number>(1);
  const isOpen = useAppSelector(
    (state) => state.SliderControlReducer.isSidebarOpen
  );

  const handleSidebarOpener = () => {
    dispatch(SliderControlSlice.actions.setShowSidebar(!isOpen));
  };

  const handleConversationClick = async (id: number) => {
    setSelectedId(id);
    dispatch(conversationSlice.actions.setLoading(true));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    dispatch(conversationSlice?.actions?.select(id));
    dispatch(conversationSlice.actions.setLoading(false));
  };

  console.log("selectedIddd", selectedId);

  return (
    <>
      <div
        className={`${
          isOpen ? "w-64" : "w-0"
        } h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 shrink-0">
          <div className="flex items-center">
            <div className="h-10 w-10 ">
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
            className="h-9 w-9 hover:bg-gray-200 cursor-pointer p-2 rounded-full"
          >
            <img className="h-full" src={sidebar} />
          </div>
        </div>

        <div className="flex-1 flex flex-col px-3 py-4 overflow-y-auto scrollbar-hide">
          <button
            className="flex items-center gap-3 w-full px-3 py-2 mb-3 text-sm rounded-lg bg-white hover:shadow-lg shrink-0 cursor-pointer"
            onClick={() => {
              const newId = Date.now();
              const newConversation = {
                id: newId,
                title: `New chat ${dummyConversations.length + 1}`,
                messages: [],
              };
              dummyConversations.unshift(newConversation);
              setSelectedId(newId);
              dispatch(conversationSlice.actions.select(newId));
            }}
          >
            <Plus size={18} />
            <span>{isOpen && "New Chat"}</span>
          </button>

          <div className="space-y-2">
            <p
              className={`${
                isOpen ? "block" : "hidden"
              } text-xs text-gray-400 mb-2`}
            >
              Recent
            </p>
            {dummyConversations.map((convo) => (
              <>
                {convo.id === selectedId ? (
                  <div
                    key={convo.id}
                    onClick={() => handleConversationClick(convo.id)}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-200 cursor-pointer text-[#3B82F6]"
                  >
                    <MessageSquare size={18} />
                    {isOpen && convo.title}
                  </div>
                ) : (
                  <div
                    key={convo.id}
                    onClick={() => handleConversationClick(convo.id)}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-200 cursor-pointer text-black"
                  >
                    <MessageSquare size={18} />
                    {isOpen && convo.title}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>

        <div className="px-3 py-4 border-t border-gray-400 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Settings size={18} />
            {isOpen && "Settings"}
          </div>
        </div>
      </div>

      {!isOpen && (
        <div className="fixed top-3 left-3 flex items-center gap-3 bg-white p-2 rounded-xl shadow-md">
          <div
            onClick={handleSidebarOpener}
            className="h-10 w-10 cursor-pointer"
          >
            <img className="h-full" src={cerebra} alt="logo" />
          </div>

          <div
            onClick={handleSidebarOpener}
            className="h-9 w-9 hover:bg-gray-200 cursor-pointer p-2 rounded-full"
          >
            <img className="h-full" src={sidebar} />
          </div>

          <button
            onClick={() => {
              const newId = Date.now();
              const newConversation = {
                id: newId,
                title: `New chat ${dummyConversations.length + 1}`,
                messages: [],
              };
              dummyConversations.unshift(newConversation);
              setSelectedId(newId);
              dispatch(conversationSlice.actions.select(newId));
            }}
            className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
