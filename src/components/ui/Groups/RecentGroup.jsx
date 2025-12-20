import React, { useEffect } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime);


const RecentGroup = () => {
    const { fetchRecentGroups, isFetchingRecentGroups, sidebarRecentGroups, selectedGroupId, setSelectedGroupId } = useChatStore();
    const { authUser } = useAuthStore();


    useEffect(() => {
        fetchRecentGroups();
    }, []);

    const handleGroupClick = async (groupId) => {
        setSelectedGroupId(groupId);
    }


    console.log(sidebarRecentGroups)
    if (isFetchingRecentGroups) {
        return <div className="p-4 text-sm text-gray-500">Loading groups…</div>;
    }

    if (!sidebarRecentGroups || sidebarRecentGroups.length === 0) {
        return <div className="p-4 text-sm text-gray-400">No recent chats</div>;
    }
    return (
        <div className="flex-1 overflow-y-auto">
            {sidebarRecentGroups.map(group => {
                const lastMessage = group.ChatMessages?.[0];
                // const user_id = group.chat_users?.[0]?.user_id;
                // const chatUser = group.chat_users?.[0];
                // messageSenderId = chat.ChatMessages?.[0].user_id;

                // const user = {
                //     user_id: chatUser.user_id,
                //     ...chatUser.user
                // };


                return (
                    <button
                        // disabled={selectedUser?.user_id === user?.user_id}
                        key={group.id}
                        onClick={()=>{handleGroupClick(group.id)}}
                        className="w-full cursor-pointer flex items-center gap-3 p-4 hover:bg-gray-100"
                    >
                        <img
                            src={group?.image_url}
                            alt={group?.name}
                            className="w-11 h-11 rounded-full border object-cover"
                        />

                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-sm">
                                    {group?.name || "Unknown"}
                                </p>

                                {lastMessage?.created_at && (
                                    <span className="text-xs text-gray-400">
                                        {dayjs(lastMessage.created_at).fromNow()}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 truncate">
                                {/* {lastMessage?.message_text || "No messages yet"} */}
                                {authUser.user_id === group.ChatMessages?.[0]?.user_id ? `You : ${lastMessage?.message_text}` : ` ${lastMessage?.user?.name} : ${lastMessage?.message_text}`}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    )
}

export default RecentGroup