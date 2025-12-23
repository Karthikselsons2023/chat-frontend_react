import { useEffect, useState, useMemo } from "react";
import { X, Search, Check } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { ArrowLeft } from 'lucide-react';

function SearchModal({ value, onChange, placeholder = "Search by Name..." }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-3 py-[7px] focus-within:border-[#998eff]">
      <Search size={18} className="text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-gray-900 outline-none"
      />
    </div>
  );
}

export default function NewChatModal({ open, onClose }) {
  const { setSelectedUser, clearMessages, createGroup, selectedGroupId, setSelectedGroupId  } = useChatStore();
  const { allUsers, isFetchingAllUsers, fetchAllUsers , authUser} = useAuthStore();

  const [search, setSearch] = useState("");
  const [isGroupMode, setIsGroupMode] = useState(false);

  // group states
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [member_ids, setMemberIds] = useState([]);

  const groupImage =
    "https://t4.ftcdn.net/jpg/03/26/08/53/360_F_326085309_CFH8PpadfnL2OQ7Gi411XW0B21YumxKo.jpg";

const filteredUsers = useMemo(() => {
  if (!Array.isArray(allUsers)) return [];

  const q = search.toLowerCase().trim();

  return allUsers
    // ❌ remove auth user
    .filter((u) => u.user_id !== authUser?.user_id)
    // 🔍 apply search
    .filter((u) => {
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
}, [search, allUsers, authUser?.user_id]);


  

  useEffect(() => {
    if (open && Array.isArray(allUsers) && allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  /* ---------- handlers ---------- */

  const handleUserClick = (user) => {
    if (isGroupMode) {
      setGroupMembers((prev) =>
        prev.some((u) => u.user_id === user.user_id)
          ? prev.filter((u) => u.user_id !== user.user_id)
          : [...prev, user]
      );
    } else {
      setSelectedGroupId(null);
      setSelectedUser(user);
      clearMessages();
      onClose();
    }
  };

  const isSelected = (userId) =>
    groupMembers.some((u) => u.user_id === userId);


  const handleCreateGroup = async () => {
    const member_ids = groupMembers.map(user=>user.user_id)
    createGroup({
      group_name: groupName,
      auth_user_id : authUser.user_id,
      member_ids : member_ids,
      description: groupDescription,
      group_img : groupImage
    });

    onClose();
    
  }

  /* ---------- UI ---------- */

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition ${
          open ? "opacity-100 backdrop-blur-sm" : "opacity-0"
        }`}
      />

      {/* modal */}
      <div
        className={`relative z-10 w-[85%] sm:w-full max-w-md h-[75vh] sm:h-[90vh] bg-white rounded-xl p-4 shadow-xl transition ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } flex flex-col`}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-2">
          
          {isGroupMode ? (
            <div className="text-[#313131] flex gap-4 items-center" >
                <button onClick={() => {setIsGroupMode((p) => !p);
                    setGroupMembers([]);
                }}>
                    <ArrowLeft className="cursor-pointer text-[#313131]" size={20}/>
                </button>
                Create new group
            </div>
          ) : (
            <h2 className="text-lg font-medium text-[#272727]">
                Start New Chat
          </h2>
          )}
          <button onClick={()=>{
            onClose();
            setIsGroupMode(false);
          }} >
            <X className="cursor-pointer" size={20} />
          </button>
        </div>

        {/* toggle */}
        

        {isGroupMode ? (
            null
        ) : 
        <button
          onClick={() => setIsGroupMode((p) => !p)}
          className="w-full bg-[#6200B3] hover:bg-[#3e0071] cursor-pointer text-sm text-white py-2 rounded-xl mt-2"
        >
          Create New Group
        </button>}

        {isGroupMode ? (
            <div className="flex w-20 h-20 items-center self-center ">
            <img
  src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg"
  className="cover border-2 border-[#383838] rounded-full"
  alt="Group"
/>
            
        </div>
        ): null}
        {/* group fields */}
        {isGroupMode && (
          <div className="mt-3 space-y-2">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full rounded-xl border-2 border-gray-300 outline-none placeholder:text-gray-400 focus-within:border-[#998eff] px-3 py-2 text-sm"
            />
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Group description"
              className="w-full rounded-xl border-2 border-gray-300 outline-none placeholder:text-gray-400 focus-within:border-[#998eff] px-3 py-2 text-sm resize-none"
              rows={2}
            />
            
            {isGroupMode && groupMembers.length > 0 && (
  <div className="mt-0 flex items-center gap-2 overflow-x-auto pb-1">
    {groupMembers.map((member) => (
      <div
        key={member.user_id}
        className="relative shrink-0"
        title={member.name}
      >
        <img
          src={member.profile}
          alt={member.name}
          className="h-10 w-10 rounded-full object-cover border-2 border-[#6d5cff]"
        />

        {/* remove member */}
        <button
          type="button"
          onClick={() =>
            setGroupMembers((prev) =>
              prev.filter((u) => u.user_id !== member.user_id)
            )
          }
          className="absolute cursor-pointer -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white mt-1 flex items-center justify-center text-[10px]"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

          </div>
        )}

        <SearchModal value={search} onChange={setSearch} />

        {/* users */}
        <div className="mt-3 flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <button
              key={user.user_id}
              onClick={() => handleUserClick(user)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                isSelected(user.user_id)
                  ? "bg-[#dde2f7]"
                  : "hover:bg-[#f1e0ff]"
              }`}
            >
              <img
                src={user.profile}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              {isGroupMode && (
                <div
                  className={`h-5 w-5 rounded border flex items-center justify-center ${
                    isSelected(user.user_id)
                      ? "bg-[#998eff] border-[#998eff]"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected(user.user_id) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* footer */}
        {isGroupMode && (
          <button
            disabled={groupMembers.length < 2 || !groupName}
            onClick={handleCreateGroup}
            className="mt-3 w-full cursor-pointer bg-[#668aff] text-white py-2 rounded-xl disabled:opacity-50"
          >
            Create Group ({groupMembers.length})
          </button>
        )}
      </div>
    </div>
  );
}
