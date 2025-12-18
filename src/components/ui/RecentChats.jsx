import React, { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthStore } from "../../store/useAuthStore";

dayjs.extend(relativeTime);

const DEFAULT_AVATAR =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

const RecentChats = () => {
    const {
        sidebarRecentChats,
        isFetchingRecentChats,
        fetchRecentChats,
        setSelectedUser,
        selectedUser
    } = useChatStore();

    const {authUser} = useAuthStore(); 


    useEffect(() => {
        fetchRecentChats();
    }, []);

    if (isFetchingRecentChats) {
        return <div className="p-4 text-sm text-gray-500">Loading chats…</div>;
    }

    if (!sidebarRecentChats || sidebarRecentChats.length === 0) {
        return <div className="p-4 text-sm text-gray-400">No recent chats</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {sidebarRecentChats.map(chat => {
                const lastMessage = chat.ChatMessages?.[0];
                const user_id = chat.chat_users?.[0]?.user_id;
                const chatUser = chat.chat_users?.[0];
                // messageSenderId = chat.ChatMessages?.[0].user_id;

                const user = {
                    user_id: chatUser.user_id,
                    ...chatUser.user
                };


                return (
                    <button
                    disabled={selectedUser?.user_id === user?.user_id}
                        key={chat.id}
                        onClick={() => setSelectedUser(user)}
                        className="w-full cursor-pointer flex items-center gap-3 p-4 hover:bg-gray-100"
                    >
                        <img
                            src={user?.profile || DEFAULT_AVATAR}
                            alt={user?.name}
                            className="w-11 h-11 rounded-full border object-cover"
                        />

                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-sm">
                                    {user?.name || "Unknown"}
                                </p>

                                {lastMessage?.created_at && (
                                    <span className="text-xs text-gray-400">
                                        {dayjs(lastMessage.created_at).fromNow()}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 truncate">
                                {/* {lastMessage?.message_text || "No messages yet"} */}
                                {authUser.user_id===chat.ChatMessages?.[0]?.user_id ? `You : ${lastMessage?.message_text}` : lastMessage?.message_text}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default RecentChats;
