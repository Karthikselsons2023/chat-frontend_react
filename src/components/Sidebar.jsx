import { useState, useEffect } from "react";
import { CircleUser, Hash, MessageSquare, Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

import SearchSidebar from "./ui/SearchSidebar";
import NewChatModal from "./ui/NewChatModal";
import ProfileDetailsModal from "./ui/ProfileDetailsModal";
import OnlineUsersSidebar from "./OnlineUsersSlider.jsx";
import RecentChats from "./ui/RecentChats.jsx";
import RecentGroup from "./ui/Groups/RecentGroup.jsx";

export default function Sidebar() {
  const { authUser } = useAuthStore();
  const { isAllUsersRecentSelected, setIsAllUsersRecentSelected } = useChatStore();

  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log("Active Tab:", isAllUsersRecentSelected);
  }, [isAllUsersRecentSelected]);

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-100 shadow-sm">
      <header className="flex items-center justify-between px-6 h-[72px] shrink-0 border-b border-slate-50">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Selsons<span className="text-[#6200B3]">.</span>
          </h1>
        </Link>
        <button
          onClick={() => setOpenProfile(true)}
          className="relative group focus:outline-none"
        >
          <div className="p-0.5 rounded-full border-2 border-transparent group-hover:border-[#6200B3] transition-all">
            {authUser?.profile ? (
              <img src={authUser.profile} className="h-9 w-9 rounded-full object-cover shadow-sm" alt="Me" />
            ) : (
              <CircleUser size={28} className="text-slate-400 group-hover:text-[#6200B3]" />
            )}
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </button>
      </header>

      <div className="px-4 pt-4 pb-2 space-y-4">
        <SearchSidebar value={query} onChange={setQuery} />
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100/80 p-1 rounded-xl flex-1 border border-slate-200/50">
            <button
              type="button"
              onClick={() => setIsAllUsersRecentSelected("all")}
              className={`flex items-center justify-center gap-2 flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                isAllUsersRecentSelected === "all"
                  ? "bg-white text-[#6200B3] shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
              }`}
            >
              <MessageSquare size={14} /> Chats
            </button>
            <button
              type="button"
              onClick={() => setIsAllUsersRecentSelected("group")}
              className={`flex items-center justify-center gap-2 flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                isAllUsersRecentSelected === "group"
                  ? "bg-white text-[#6200B3] shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
              }`}
            >
              <Hash size={14} /> Groups
            </button>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-[#6200B3] text-white rounded-xl hover:bg-[#4d008c] transition-all hover:rotate-90 active:scale-95 shadow-md shadow-purple-200"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="py-2 border-y border-slate-50/50 bg-slate-50/30">
        <OnlineUsersSidebar />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 scrollbar-hide">
        <div className="px-6 mb-3 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
            {isAllUsersRecentSelected === "all" ? "Recent Messages" : "Group Discussions"}
          </span>
          <div className="h-px bg-slate-100 flex-1 ml-4" />
        </div>
        <div key={isAllUsersRecentSelected} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {isAllUsersRecentSelected === "all" ? (
            <RecentChats />
          ) : (
            <RecentGroup />
          )}
        </div>
      </div>

      <ProfileDetailsModal open={openProfile} onClose={() => setOpenProfile(false)} />
      <NewChatModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
