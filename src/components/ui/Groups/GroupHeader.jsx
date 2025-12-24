import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Plus } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';

const GroupHeader = () => {
  const { onlineUsers, authUser, allUsers } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [openNewMembersPanel, setOpenNewMembersPanel] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [makingAdmin, setMakingAdmin] = useState(false);
  const [removingMember, setRemovingMember]= useState(false);
  const [removingAdmin, setRemovingAdmin] = useState(false);

  const {
    groupInfo,
    setSelectedUser,
    setSelectedGroupId,
    setGroupInfo,
    selectedGroupId,
    isGroupAdmin,
    setIsGroupAdmin,
    addMembers,
    makeAdmin,
    removeMember,
    removeAdmin,    
    } = useChatStore();

  useEffect(() => {
    setGroupInfo();
  }, [selectedGroupId,isAddingMembers,makingAdmin,removingMember,removingAdmin,isAddingMembers]);

useEffect(() => {
  if (!groupInfo || !authUser) {
    setIsGroupAdmin(false);
    return;
  }

  const isAdmin = groupInfo.chat_users.some(
    (u) =>
      u.user_id === authUser.user_id &&
      u.group_admin === true
  );

  setIsGroupAdmin(isAdmin); // ✅ always set
}, [groupInfo, authUser]);




  const groupUserIds = new Set(
    groupInfo?.chat_users?.map((u) => u.user_id)
  );

  const usersNotInGroup = allUsers?.filter(
    (user) => !groupUserIds.has(user.user_id)
  );

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };


  if (!groupInfo) {
    return <div className="p-3 text-sm text-gray-500">Fetching group details…</div>;
  }

  const handleAddMember = async (e) => {
    setIsAddingMembers(true);
    e.preventDefault();
    // console.log(selectedUserIds);
    const addMemberPayload = {
      auth_id : authUser.user_id,
      user_id : selectedUserIds,
      chat_id : selectedGroupId
    }
    console.log("payload add members: ", addMemberPayload);

    await addMembers(addMemberPayload);

    setIsAddingMembers(false);
    setOpenNewMembersPanel(false);
  }

  const handleMakeAdmin = async (user_id) => {

    // user_id.preventDefault();
    setMakingAdmin(true);
    const payload = {
      auth_id : authUser.user_id,
      user_id : user_id,
      chat_id : selectedGroupId,
    };
    await makeAdmin(payload);
    // console.log("payload: ",payload);
    setMakingAdmin(false);
  }

  const handleRemoveMember = async (user_id) => {
    setRemovingMember(true);
    const payload = {
      auth_id : authUser.user_id,
      user_id : user_id,
      chat_id : selectedGroupId,
    };
    await removeMember(payload);
    // console.log("payload: ",payload);
    setRemovingMember(false);
  }



  const handleRemoveAdmin = async (user_id) => {
    setRemovingAdmin(true);
  const payload = {
    auth_id: authUser.user_id,
    user_id,
    chat_id: selectedGroupId,
  };
  await removeAdmin(payload);
  setRemovingAdmin(false);
  
};


  // console.log(groupInfo)

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
        className={`fixed inset-0 z-50  flex items-center inter-large justify-center
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
            relative z-10 w-160 h-[90vh] mx-4 rounded-xl bg-white p-5 shadow-xl
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

              <div className="flex flex-row gap-2 mt-1">
                <button disabled={!isGroupAdmin} className={`w-full bg-[#6200B3] p-1 rounded-md mt-3 text-sm text-white ${!isGroupAdmin ? " cursor-not-allowed bg-[#656565]" : " hover:bg-[#3e0071] cursor-pointer "}`}>
                  Save
                </button>
                <button className={`w-full cursor-pointer bg-[#e32b0a] hover:bg-[#9b1f09] p-1 rounded-md mt-3 text-sm text-white `}>
                  Leave Group
                </button>
              </div>
              {/* <p className="text-sm text-gray-500">
                {groupInfo.chat_users?.length || 0} members
              </p> */}
            </div>
          </div>

          {/* Members */}
          <div className="mt-5">
            <div className="flex flex-row justify-between">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Members
              </p>
              {!openNewMembersPanel && isGroupAdmin? (
                <button className="p-1 px-3 text-xs bg-transparent rounded-md cursor-pointer flex items-center gap-2 text-black " onClick={() => { setOpenNewMembersPanel(true) }}> <Plus size={18} /> Add new members</button>
              ) : null}

              {openNewMembersPanel && (
                <button className="p-1 px-3 text-xs bg-transparent rounded-md cursor-pointer flex items-center gap-1 text-black  " onClick={() => { setOpenNewMembersPanel(false) }}><ArrowLeft size={15} />Back</button>
              )}
            </div>

            {/* {openNewMembersPanel && (
              <input
                type="text"
                placeholder="Add more members..."
                className="w-full border-2 p-1.5 px-3 rounded-xl text-black border-[#9a9a9a] text-xs mt-2 mb-1 outline-none"
              />
            )} */}



            {!openNewMembersPanel && (
              <div className="flex flex-col overflow-y-auto sm:h-70 h-100  w-full gap-2">

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
                    <div className="dropdown">
                      <div tabIndex={0} role="button" className={`btn bg-transparent text-black border-none shadow-none ${user.user_id !== authUser.user_id ? null : "hidden"}`}><EllipsisVertical size={20} /></div>
                      {user.user_id !== authUser.user_id && (
                        <ul tabIndex="-1" className="dropdown-content text-black   menu bg-white rounded-box z-1 w-52 p-2 shadow-sm -translate-x-40 -translate-y-13">
                        {isGroupAdmin && user.user_id !== authUser.user_id && (
                          <li>
                            <button
                              onClick={() =>
                                user.group_admin
                                  ? handleRemoveAdmin(user.user_id)
                                  : handleMakeAdmin(user.user_id)
                              }
                            >
                              {user.group_admin
                                ? "Remove Admin"
                                : makingAdmin
                                  ? "Loading..."
                                  : "Make Admin"}
                            </button>
                          </li>
                        )}


                        {isGroupAdmin && user.user_id !== authUser.user_id && (
                          <li>
                            <button onClick={() => handleRemoveMember(user.user_id)}>
                              {removingMember ? "Removing..." : "Remove"}
                            </button>
                          </li>
                        )}
                        
                        {user.user_id !== authUser.user_id && (
                         <li><button onClick={() => { setSelectedUser(user) }}>Message</button></li> )}

                      </ul>
                      )}
                      
                    </div>
                  </div>
                ))}
              </div>
            )}


            {openNewMembersPanel && (
              <div className="flex flex-col overflow-y-auto sm:h-60 h-90 w-full gap-2 mt-2">

                {usersNotInGroup?.length === 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    All users are already in this group
                  </p>
                )}

                {usersNotInGroup?.map((user) => {
                  const isSelected = selectedUserIds.includes(user.user_id);

                  return (
                    <button
                      key={user.user_id}
                      onClick={() => toggleUserSelection(user.user_id)}
                      className={`flex items-center gap-3 p-2 rounded-md border-b-2 
            ${isSelected
                          ? "bg-[#EAD7FF] border-none"
                          : "bg-white border-gray-100 hover:bg-[#F5ECFF]"
                        }`}
                    >
                      <img
                        src={user.profile}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />

                      <p className="text-sm text-black flex-1 text-left">
                        {user.name}
                      </p>

                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="accent-[#6200B3]"
                      />
                    </button>
                  );
                })}
              </div>
            )}

        
            {openNewMembersPanel &&  (
              <button onClick={handleAddMember} className="w-full cursor-pointer text-center p-1 text-sm bg-[#6200B3] hover:bg-[#420078] text-white rounded-md mt-2">
                {isAddingMembers? <span className="loading loading-spinner loading-xs"></span> : "Add Members"}
              </button>
            )}


            



          </div>
        </div>
      </div>

    </>
  );
};

export default GroupHeader;