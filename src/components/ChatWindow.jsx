import ChatHeader from "./ui/ChatHeader";
import MessageInput from "./ui/MessageInput";
import ChatArea from "./ui/ChatArea";

export default function ChatWindow({ chat, onBack }) {
  return (
    <div className="transition-all flex flex-col h-screen bg-[#ECECEC]">
      

      <div className="shrink-0 bg-white">
        <ChatHeader chat={chat} onBack={onBack} />
      </div>


      <div className="flex-1 overflow-y-auto ">
        <ChatArea />
      </div>


      <div className="shrink-0  bg-white">
        <MessageInput />
      </div>

    </div>
  );
}
