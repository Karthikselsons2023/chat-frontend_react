import ChatHeader from "./ui/ChatHeader";
import MessageInput from "./ui/MessageInput";
import ChatArea from "./ui/ChatArea";
import { useChatStore } from "../store/useChatStore";
import ForwardingMessageBottomBar from "./ui/ForwardingMessageBottomBar";

export default function ChatWindow({ chat, onBack }) {
  const {isSelecting} = useChatStore();
  return (
    <div className="transition-all flex flex-col h-screen bg-[#ECECEC]">
      

      <div className="shrink-0 bg-white">
        <ChatHeader chat={chat} onBack={onBack} />
      </div>


      <div className="flex-1 overflow-y-auto ">
        <ChatArea />
      </div>


      <div className="shrink-0  bg-white">
        {isSelecting === true ? <ForwardingMessageBottomBar /> :  <MessageInput />}
        
      </div>

    </div>
  );
}
