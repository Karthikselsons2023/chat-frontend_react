import React from 'react'
import { X } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore'
import { useAuthStore } from '../../store/useAuthStore';

const ChatHeader = () => {
    const {selectedUser,setSelectedUser, setSelectedGroupId,selectedGroupId} = useChatStore();
    const { onlineUsers } = useAuthStore();

  return (
    <div className="nochatbg text-main flex justify-between border-b-1 border-gray-300 ">
            <div className="flex p-3 gap-5">
              <img
                  src={selectedUser.profile || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                  className="size-10 object-cover rounded-full border border-muted p-[0.1rem]"
              />
              <div>
                <h2 className="inter-very-large text-black">{selectedUser.name}</h2>
    
                  {onlineUsers.includes(selectedUser.user_id) ? (
                      <h2 className="inter-large text-xs text-left text-green-600">Online</h2>
                  ) : (<h2 className="inter-small text-xs text-muted text-left ">Offline</h2>)}
    
              </div>
            </div>
    
            <button onClick={() => {setSelectedUser(null);
              setSelectedGroupId(null);
            }} className="cursor-pointer mr-5 text-black">
              <X />
            </button>
          </div>
  )
}

export default ChatHeader