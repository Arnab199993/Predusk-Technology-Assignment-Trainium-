import Message from "../../Component/Chat/Message";
import Sidebar from "../../Component/Chat/Sidebar";

const Chat = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Message />
    </div>
  );
};

export default Chat;
