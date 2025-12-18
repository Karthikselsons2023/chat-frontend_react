import { useState } from "react";
import SearchSidebar from "./ui/SearchSidebar";
import Selector from "./ui/Selector";
import { PencilLine } from 'lucide-react';
import NewChatModal from "./ui/NewChatModal";
import { CircleUser } from 'lucide-react';
import ProfileDetailsModal from "./ui/ProfileDetailsModal";
import { Link } from "react-router-dom";
import OnlineUsersSidebar from "./OnlineUsersSlider.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import RecentChats from "./ui/RecentChats.jsx";

const chats = [
  { id: 1, name: "Regis Saffi", last: "Checkout this project" },
  { id: 2, name: "Claire", last: "Haha oh man" },
  { id: 3, name: "Joe", last: "That’s terrifying 😂" },
];

export default function Sidebar({ onSelect }) {
  const {onlineUsers,authUser} = useAuthStore();
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <div className="h-full flex flex-col inter-large text-[#383838] border-gray-300 border-r-1">
        <div className="flex flex-row items-center justify-between p-4 font-semibold border-b bg-[#f3f4ff] border-gray-300 inter-very-large text-2xl">
          <Link to="/"><h1>Selsons <span className="text-[#6200B3] inter-large">Chat </span></h1> </Link>
          <button onClick={() => setOpenProfile(true)} className="text-[#383838] hover:text-[#6200B3] cursor-pointer rounded-full"><CircleUser size={26} className=" " /></button>
          {/* <button onClick={() => setOpenProfile(true)} className="text-black cursor-pointer rounded-full"><img src={authUser.profile} className="h-8 w-8 rounded-full object-cover"/></button> */}
        </div>
        
      <SearchSidebar value={query} onChange={setQuery} />
      <div className="flex justify-between h-11 mb-2 items-center">
        <div className="flex flex-row">
          <Selector label={'All'} />
          <Selector label={'Groups'} />
        </div>
        <button onClick={() => setOpen(true)} className="px-5 bg-[#6200B3] text-white inline-flex whitespace-nowrap items-center justify-center text-sm py-[5px] ml-3 mt-3 rounded-xl cursor-pointer hover:bg-[#420078]  border-[#6200B3] hover:border-[#420078] border-[1.9px] gap-2 mr-3">New Chat / Group <PencilLine size={16} className=""/></button>
        
       

       <ProfileDetailsModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        title="Start new chat"
      >
        

        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-white"
        >
          Continue
        </button>
      </ProfileDetailsModal>

      <NewChatModal
        open={open}
        onClose={() => setOpen(false)}
        title="Start new chat"
      >
        

        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-white"
        >
          Continue
        </button>
      </NewChatModal>
      </div>
      <OnlineUsersSidebar />
      {/* <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <div className="font-medium">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {chat.last}
              </div>
            </div>
          </div>
        ))}
      </div> */}
      <div className="flex-1 overflow-y-auto">
        <RecentChats />
      </div>
    </div>
  );
}
