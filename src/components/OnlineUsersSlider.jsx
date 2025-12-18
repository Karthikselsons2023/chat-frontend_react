import { useEffect, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Dot } from 'lucide-react';
import { useChatStore } from "../store/useChatStore";

const OnlineUsersSlider = () => {
  const {
    onlineUsers,   // ["SL22333", "SL22444"]
    allUsers,      // full user objects
    fetchAllUsers,
    authUser,
    selectedUser
  } = useAuthStore();

  const {setSelectedUser} = useChatStore();

  // fetch all users once
  useEffect(() => {
    if (allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [allUsers.length, fetchAllUsers]);

  // merge socket + DB
const onlineUserDetails = useMemo(() => {
  if (
    !Array.isArray(onlineUsers) ||
    !Array.isArray(allUsers) ||
    !authUser
  ) {
    return [];
  }

  return allUsers.filter(user =>
    onlineUsers.includes(user.user_id) &&
    user.user_id !== authUser.user_id
  );
}, [onlineUsers, allUsers, authUser?.user_id]);


  if (onlineUserDetails.length === 0) {
    return <div className="text-sm text-center  pb-3 pt-3 text-gray-400">No users online</div>;
  }


  

  return (
    <div>
    <h2 className="flex text-green-600 text-xs items-center ml-3 mt-1 inter-very-large">Online Users:</h2>
    <div className="flex gap-3 overflow-x-auto py-2 mx-2">
      
      {onlineUserDetails.map(user => (
        <button
          key={user.user_id}
          className="cursor-pointer flex flex-col items-center min-w-[70px]"
          disabled={selectedUser?.user_id === user?.user_id}
          onClick={() => {
            // console.log("selected user id",selectedUser?.user_id)
            if (selectedUser?.user_id === user.user_id) return;
            setSelectedUser(user);
          }}
        >
          <img
            src={user.profile}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-3 border-[#6200B3]"
          />
          <span className="text-xs mt-1 text-center truncate w-16">
            {user.name}
          </span>
        </button>
      ))}
    </div>
    </div>
  );
};

export default OnlineUsersSlider;
