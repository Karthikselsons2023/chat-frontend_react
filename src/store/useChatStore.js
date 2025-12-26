import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";


export const useChatStore = create((set, get) => ({
  messages: [],
  groupMessages:[],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  currentPage: 'home',
  isTyping: false,
  creatingGroup: false,
  selectedGroupId: null,
  groupInfo: null,
  isFetchingGroupInfo: false,
  isFetchingRecentChats: false,
  isFetchingRecentGroups: false,
  sidebarRecentChats : null,
  sidebarRecentGroups: null,
  isUploadingFile: false,
  isAllUsersRecentSelected: "all",
  isGroupAdmin : false,
  fetchingGroupMessages: false,
  isAddingMembers : false,
  isSelecting : false,

  setIsSelecting: async (value) => {
    set({isSelecting: value});
  },


  setIsAddingMembers: async (value) => {
    set({isAddingMembers: value});
  },


  makeAdmin: async (payload) => {
    try {
      console.log(payload)
      const res = await axiosInstance.post("/chat/groupmakeadmin", payload);
      const result = res.data;
      
    } catch (error) {
      console.log("Error in making admin: ",error);
    }
  },

  removeAdmin: async (payload) => {
    try {
      console.log(payload);
      const res = await axiosInstance.post("/chat/removeadmin", payload);
      const result = res.data;
    } catch (error) {
      console.log("Error in removing admin: ", error);
    }
  },

    removeMember: async (payload) => {
    try {
      console.log(payload);
      const res = await axiosInstance.post("/chat/removegroupmember", payload);
      const result = res.data;
      
    } catch (error) {
      console.log("Error in making admin: ",error);
    }
  },

  addMembers : async (payload) => {
    try {
      const res = await axiosInstance.post("/chat/groupaddpeople",payload);
      const result = res.data;
      console.log("added new members to group: ", result);
      
    } catch (error) {
      console.log("error while adding new members to group: ", error);
    }
  },


setIsGroupAdmin: (adminOrNot) => {
  console.log(
    adminOrNot ? "You are group admin" : "You are NOT group admin"
  );

  set({ isGroupAdmin: Boolean(adminOrNot) });
},




  setIsAllUsersRecentSelected: async (type) => {
    set({isAllUsersRecentSelected: type});
  },


 
  emitTyping: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    const { selectedUser } = get();

    if (!selectedUser) return;

    
  },

  emitStopTyping: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    const { selectedUser } = get();

    if (!selectedUser) return;

    socket.emit("stopTyping", {
      senderId: authUser.user_id,
      receiverId: selectedUser.user_id,
    });
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    socket.on("typing", ({ senderId }) => {
      if (senderId === selectedUser?.user_id) {
        set({ isTyping: true });
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser?.user_id) {
        set({ isTyping: false });
      }
    });
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("typing");
    socket.off("stopTyping");
  },
  clearMessages : async () => {
    set({messages: []});
  },
  createGroup : async ({group_name, auth_user_id,member_ids,description, group_img}) => {
    if(!group_name || !member_ids || !auth_user_id){
      return;
    }
    set({creatingGroup: true});
    try {
      const res = await axiosInstance.post("/chat/createGroup", {
        group_name: group_name,
        auth_user_id: auth_user_id,
        member_ids: member_ids,
        description: description,
        group_img, group_img
      });
      
      const result = res.data;
      set({selectedUser: null});
      set({selectedGroupId: result.chat_id});
      console.log("created group id: ",result.chat_id);
      
      
    } catch (error) {
      console.log("error in creating group/ sending group data: ",error);
    }finally{
      set({ creatingGroup: false });
    }
  },

  setSelectedGroupId: async (groupId) => {
    const { emitJoinGroup } = get();

    set({ selectedUser: null });
    set({ selectedGroupId: groupId });

    emitJoinGroup(groupId);
  },

  emitJoinGroup: (groupId) => {
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;
    if (!groupId || !authUser) return;
    

    socket.emit("joinGroup", {
      chat_id: groupId,
      user_id: authUser.user_id,
    });
  },


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async ({ sender_id, receiver_id }) => {
  if (!sender_id || !receiver_id) return;

  set({ isMessagesLoading: true });

  try {
    const res = await axiosInstance.get(
      `/chat/getMessages?receiver_id=${receiver_id}&sender_id=${sender_id}`
    );

    console.log("received messages:", res.data);

    set({ messages: res.data.formattedMessages});
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to load messages"
    );
  } finally {
    set({ isMessagesLoading: false });
  }
},

  subscribeToMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;
  const authUser = useAuthStore.getState().authUser;

  socket.on("newMessage", (newMessage) => {
  const isCurrentChat =
    (newMessage.user_id === selectedUser.user_id &&
      newMessage.receiver_id === authUser.user_id) ||
    (newMessage.user_id === authUser.user_id &&
      newMessage.receiver_id === selectedUser.user_id);

  if (!isCurrentChat) return;

  set({ messages: [...get().messages, newMessage] });
});

},
subscribeToGroupMessages: () => {
  const { selectedGroupId } = get();
  if (!selectedGroupId) return;

  const socket = useAuthStore.getState().socket;

  socket.on("newGroupMessage", (msg) => {
    if (String(msg.chat_id) !== String(selectedGroupId)) return;

    set({
      groupMessages: [...get().groupMessages, msg],
    });
  });
},


unSubscribeToGroupMessages : async () => {
  const socket = useAuthStore.getState().socket;
  socket.off("newGroupMessage");
},



  unsubscribeToMessages:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setPage: (page) => {
    console.log("Setting page to:", page);
    set({ currentPage: page })
  },
  setSelectedUser: (selectedUserObject) => {
    const selectedUser = get().selectedUser; 
    if (selectedUserObject === selectedUser) {
      return;
    }

    set({
      selectedUser : selectedUserObject,
      messages: [],
    });
    console.log("selected user ", selectedUserObject)
    set({ selectedGroupId: null });

  },
//  sendMessage: async (payload) => {
//   console.log("POST /chat/send payload:", payload);
//   await axiosInstance.post("/chat/send", payload);
// },



sendMessage: async (payload) => {
  console.log("send message payload:", payload);

  let uploadedFileUrl = ""; // ✅ single source of truth

  const authUser = useAuthStore.getState().authUser;
  const { selectedUser } = get();

  try {
    // 1️⃣ Upload file if exists
    if (payload.file) {
      const presignRes = await axiosInstance.post("/chat/presigned-url", {
        fileName: payload.file.name,
        fileType: payload.file.type,
        folder: "uploads",
      });

      const { uploadUrl, fileUrl } = presignRes.data;

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": payload.file.type,
        },
        body: payload.file,
      });

      uploadedFileUrl = fileUrl; // ✅ FIXED
      console.log("File uploaded:", uploadedFileUrl);
    }
    

    // 2️⃣ Send message
    console.log("senderid: ",authUser.user_id,"receiver_id: ",selectedUser.user_id,"message_text: ",payload.message_text?.trim() || "", "file_name : " ,uploadedFileUrl, "file_type: ",payload.file?.type || "");
    const res = await axiosInstance.post("/chat/send", {
      sender_id: authUser.user_id,
      receiver_id: selectedUser.user_id,
      message_text: payload.message_text?.trim() || "",
      file_url: uploadedFileUrl,
      file_type: payload.file?.type || "",
    });

    console.log("sent message.");

  } catch (error) {
    console.error("sendMessage error:", error);
  }
},


getGroupMessages: async () => {
  set({fetchingGroupMessages : true});
  try {
    console.log("fetched chat id: ");
    const selectedGroupId = get().selectedGroupId;
    const res = await axiosInstance(`/chat/getGroupMessages?chatId=${selectedGroupId}`);
    const result = res.data;
    set({groupMessages:result.formattedMessages});
    console.log("fetched group chats: ",result);
  } catch (error) {
    console.log("Error in fetching group messages: ",error);
  } finally{
    set({fetchingGroupMessages : false});
  }
},


sendGroupMessage : async (payload) => {
  console.log("send message payload:", payload);
  let uploadedFileUrl = ""; // ✅ single source of truth

  const authUser = useAuthStore.getState().authUser;
  const { selectedGroupId } = get();

  try {
    if (payload.file) {
      const presignRes = await axiosInstance.post("/chat/presigned-url", {
        fileName: payload.file.name,
        fileType: payload.file.type,
        folder: "uploads",
      });

      const { uploadUrl, fileUrl } = presignRes.data;

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": payload.file.type,
        },
        body: payload.file,
      });

      uploadedFileUrl = fileUrl; 
      console.log("File uploaded:", uploadedFileUrl);
    }
    

    
    console.log("user_id: ",authUser.user_id," chat_id: ",selectedGroupId," message_text: ",payload.message_text?.trim() || "", "file_name : " ,uploadedFileUrl, "file_type: ",payload.file?.type || "");
    const res = await axiosInstance.post("/chat/sendGroupMessage", {
      user_id: authUser.user_id,
      chat_id: selectedGroupId,
      message_text: payload.message_text?.trim() || "",
      file_url: uploadedFileUrl,
      file_type: payload.file?.type || "",
      name: authUser.name,
      profile: authUser.profile,
    });

    console.log("sent message.");

  } catch (error) {
    console.error("sendMessage error:", error);
  }
},



  setGroupInfo: async () => {
    set({ isFetchingGroupInfo: true });

    const selectedGroupId = get().selectedGroupId;

    try {
      const res = await axiosInstance.get(
        `/chat/groupInfo?chatId=${selectedGroupId}`
      );

      const result = res.data;

      set({ groupInfo: result.groupInfo });
      console.log("Group info from usechat store:", result);
    } catch (error) {
      console.log("error in fetching group info in frontend:", error);
    } finally {
      set({ isFetchingGroupInfo: false });
    }
  },


  fetchRecentGroups : async () => {
    set({isFetchingRecentGroups: true});

    try {
      const authUser = useAuthStore.getState().authUser;

      if(!authUser?.user_id) {
        console.warn("No auth user, skipping recent chats fetch");
        return;
      }

      const res = await axiosInstance.get(`/chat/groupsidebar?user_id=${authUser.user_id}`);

      set({sidebarRecentGroups: res.data.groupChatList});

    } catch (error) {
      console.log("Error in fetching recent groups:", error);
    } finally {
      set({ isFetchingRecentGroups: false });
    }
  },

  fetchRecentChats: async () => {
    set({ isFetchingRecentChats: true });

    try {
      const authUser = useAuthStore.getState().authUser;

      if (!authUser?.user_id) {
        console.warn("No auth user, skipping recent chats fetch");
        return;
      }

      const res = await axiosInstance.get(
        `/chat/sidebarChats?user_id=${authUser.user_id}`
      );

      set({ sidebarRecentChats: res.data.chatList });

      console.log(
        "Fetched sidebar chats:",
        res.data.chatList
      );
    } catch (error) {
      console.log("Error in fetching recent chats:", error);
    } finally {
      set({ isFetchingRecentChats: false });
    }
  },

  uploadFile: async ({ file, fileName, fileType }) => {
    set({ isUploadingFile: true });

    try {
    // 1️⃣ get presigned URL
    const res = await axiosInstance.post("/chat/presigned-url", {
      fileName,
      fileType,
      folder: "uploads"
    });

    const { uploadUrl, fileUrl } = res.data;

    // 2️⃣ PUT file to S3
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType
      },
      body: file
    });

    console.log("File uploaded successfully:", fileUrl);

    return fileUrl; // 🔥 VERY IMPORTANT
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  } finally {
    set({ isUploadingFile: false });
  }
}


}));
