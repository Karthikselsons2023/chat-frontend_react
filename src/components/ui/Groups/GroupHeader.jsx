import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";

const GroupHeader = () => {
  const { onlineUsers , authUser} = useAuthStore();
  const [open, setOpen] = useState(false);

  const {
    groupInfo,
    setSelectedUser,
    setSelectedGroupId,
    setGroupInfo,
    selectedGroupId,
    isGroupAdmin,
    setIsGroupAdmin
  } = useChatStore();

  useEffect(() => {
    setGroupInfo();
  }, [selectedGroupId]);

    useEffect(() => {
  if (!groupInfo || !authUser) return;

  const isAdmin = groupInfo.chat_users.some(
    (u) => u.user_id === authUser.user_id && u.group_admin === true
  );
  if(isAdmin){
    setIsGroupAdmin("true");
  }
  
}, [groupInfo, authUser]);

  if (!groupInfo) {
    return <div className="p-3 text-sm text-gray-500">Fetching group details…</div>;
  }




  console.log(groupInfo)

  return (
    <>

      <div className="nochatbg flex items-center inter-large  justify-between border-b border-gray-300">
        <button
          onClick={() => setOpen(true)}
          className="flex cursor-pointer  w-full items-center gap-4 p-3 opacity-100 hover:opacity-50  "
        >
          <img
            src={
              groupInfo.group_image ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt={groupInfo.group_name}
            className="h-10 w-10 rounded-full object-cover border"
          />

          <div className="flex flex-col text-left">
            <h2 className="text-sm font-semibold text-black">
              {groupInfo.group_name}
            </h2>
            <p className="text-xs text-gray-500">
              Click to view group details
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            setSelectedUser(null);
            setSelectedGroupId(null);
          }}
          className="mr-4 text-black hover:text-gray-600 cursor-pointer"
        >
          <X />
        </button>
      </div>


      <div
        className={`fixed inset-0 z-50 flex items-center inter-large justify-center
          transition-all duration-300
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >

        <div
          onClick={() => setOpen(false)}
          className={`
            absolute inset-0 bg-black/40
            transition-all duration-300
            ${open ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"}
          `}
        />


        <div
          className={`
            relative z-10 w-140  mx-4 rounded-xl bg-white p-6 shadow-xl
            transform transition-all duration-300 ease-out
            ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          `}
        >

          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black transition"
          >
            <X size={20} />
          </button>


          <h3 className="text-lg inter-very-large font-bold text-[#6200B3]">
            Group Info
          </h3>


          <div className="mt-4 flex sm:flex-row gap-4 sm:gap-6 flex-col  items-center">

            <div>
              <img
                src={
                  groupInfo.group_image ||
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                className="self-center cursor-pointer hover:opacity-50 h-20 w-20 object-cover rounded-full border"
              />
              <p className="inter-large mt-3 text-[#7a7a7a] text-xs self-center">Profile Image</p>
            </div>
            <div>
              <p className="font-medium text-[#7a7a7a] text-xs inter-large">
                Group Name
              </p>
              <div>
                <input
                  className={`flex items-center gap-2 text-sm h-8 rounded-md w-80 sm:w-100 mt-1 border-2 border-gray-300 bg-white px-3 text-black focus-within:border-[#b766f9]
    ${!isGroupAdmin ? "cursor-not-allowed opacity-60" : ""}
  `}
                  defaultValue={groupInfo.group_name}
                  disabled={!isGroupAdmin}
                />

              </div>


              <p className="font-medium text-[#7a7a7a] text-xs inter-large mt-3">
                Group Description
              </p>
              <div>
                <input
                  className={`flex items-center gap-2 text-sm h-8 rounded-md w-80 sm:w-100 mt-1 border-2 border-gray-300 bg-white px-3 text-black focus-within:border-[#b766f9]
    ${!isGroupAdmin ? "cursor-not-allowed opacity-60" : ""}
  `}
                  defaultValue={groupInfo.group_description}
                  disabled={!isGroupAdmin}
                />
              </div>

              <button disabled={!isGroupAdmin} className={`w-full bg-[#6200B3] p-1 rounded-md mt-3 text-sm text-white ${!isGroupAdmin ? " cursor-not-allowed bg-[#656565]" : " hover:bg-[#3e0071] cursor-pointer "}`}>
                Save
              </button>

              {/* <p className="text-sm text-gray-500">
                {groupInfo.chat_users?.length || 0} members
              </p> */}
            </div>
          </div>

          {/* Members */}
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Members
            </p>



            <div className="flex flex-col overflow-y-auto h-50 w-full gap-2">
              {groupInfo?.chat_users.map((user) => (
                <div
                  key={user.user_id}
                  className="border-b-2 border-[#ebebeb68] flex items-center gap-3 p-2 rounded-md hover:bg-[##F1E0FF]"
                >
                 
                  <img
                    src={user.user.profile}
                    className="h-8 w-8 rounded-full object-cover"
                    alt={user.user.name}
                  />
                  <div className="flex flex-row justify-between w-full ">
                    <p className="text-sm font-medium text-black">
                      {user.user.name}
                    </p>
                    {user.group_admin && (
                      <span className="text-[10px] text-[#6200B3]">Admin</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupHeader;
