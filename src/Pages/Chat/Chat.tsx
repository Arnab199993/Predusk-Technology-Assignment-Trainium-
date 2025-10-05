import { useEffect } from "react";
import Message from "../../Component/Chat/Message";
import Sidebar from "../../Component/Chat/Sidebar";
import { useAppDispatch } from "../../Hooks/Hooks";
import { initializeConversations } from "../../Core/Conversation";
import conversationSlice from "../../Redux/ConversationSlice";

const Chat = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initialConversations = initializeConversations();
    dispatch(
      conversationSlice.actions.initializeConversations(initialConversations)
    );

    if (initialConversations.length > 0) {
      dispatch(
        conversationSlice.actions.selectConversation(initialConversations[0].id)
      );
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Message />
    </div>
  );
};

export default Chat;
