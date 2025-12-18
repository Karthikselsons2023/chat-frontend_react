import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";

const GroupHeader = () => {
  const { onlineUsers } = useAuthStore();

  const {
    groupInfo,
    setSelectedUser,
    setSelectedGroupId,
    setGroupInfo,
    selectedGroupId
  } = useChatStore();

  console.log("group info",groupInfo)

  useEffect(()=>{
    setGroupInfo();
  },[selectedGroupId])
  
  if (!groupInfo) return (
    <div>
      fetching group details
    </div>
  );

  return (
    <div className="nochatbg text-main flex justify-between border-b border-gray-300">
      <div className="flex p-3 gap-4 items-center">
        <img
          src={
            groupInfo.group_image ||
            "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          }
          alt={groupInfo.group_name}
          className="h-10 w-10 object-cover rounded-full border border-gray-300"
        />

        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-black">
            {groupInfo.group_name}
          </h2>

          

          <div className="text-xs text-gray-500 flex flex-row">
            Members: 
            {groupInfo.chat_users.map((item)=>(
              <p>{item.user.name},</p>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedUser(null);
          setSelectedGroupId(null);
        }}
        className="mr-4 text-black hover:text-gray-600"
      >
        <X />
      </button>
    </div>
  );
};

export default GroupHeader;
