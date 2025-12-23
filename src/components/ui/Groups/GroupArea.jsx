import React, { useEffect,useRef,useState  } from 'react'
import { useChatStore } from '../../../store/useChatStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { formatMessageTime } from '../../../lib/utils';
import {
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  File,
  X,
} from "lucide-react";

const GroupArea = () => {

  const { authUser } = useAuthStore();
  const { selectedGroupId, getGroupMessages,groupMessages,fetchingGroupMessages,subscribeToGroupMessages,unSubscribeToGroupMessages  } = useChatStore();
  
  const getFileNameFromUrl = (url) => {
  try {
    if (!url) return "file name";
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop());
  } catch (err) {
    console.error("Invalid file URL:", url);
    return "Attachment";
  }
};
  const bottomRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);


  useEffect(() => {
    if (!selectedGroupId || !authUser) return;
    getGroupMessages();
    subscribeToGroupMessages();
    console.log("group messages from group area: ",groupMessages);
    
    return () => {
      unSubscribeToGroupMessages();
    }
      console.log("groupmessages: ", groupMessages);
  }, [selectedGroupId]);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [groupMessages]);

  const truncateFileName = (name, maxChars = 25) => {
    if (!name) return "";
    return name.length <= maxChars ? name : name.slice(0, maxChars) + "...";
  };

   const getFileIcon = (type) => {
    if (!type) return <File size={24} />;

    if (type.startsWith("image/")) return <FileImage size={24} />;
    if (type.includes("pdf")) return <img className="w-8 h-full " src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1667px-PDF_file_icon.svg.png" />;  
    if (type.includes("word") || type.includes("msword"))
      return <img className="w-8 h-full " src="https://cdn-icons-png.flaticon.com/512/9496/9496487.png" />;
    
    if (type.includes("excel") || type.includes("spreadsheet"))
      return <img className="w-8 h-full " src="https://www.freeiconspng.com/thumbs/excel-icon/excel-icon-12.png" />;
    if (type.includes("zip") || type.includes("compressed"))
      return <img className="w-8 h-full " src="https://cdn-icons-png.flaticon.com/512/2656/2656401.png" />;
    if (type.includes("video") || type.includes("mp4"))
      return <img className="w-8 h-full " src="https://static.vecteezy.com/system/resources/thumbnails/010/161/430/small/3d-rendering-blue-clapperboard-with-play-icon-isolated-png.png" />
    return <File size={24} />;
  };


  if (fetchingGroupMessages) {
    return (
      <div className="flex-1 flex mt-30 text-black items-center justify-center">
        <span className="loading text-black loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className='p-5 inter-large'>
      {previewImage && (
        <dialog open className="modal ">
          <div className="modal-box flex flex-col items-center sm:w-1/2 w-full bg-white">
            <div className="flex  justify-end w-full mb-3">
              
              <button onClick={() => setPreviewImage(null)} >
                <X size={20} className=" cursor-pointer text-black"/>
              </button>
              
            </div>
            <img
              src={previewImage}
              className="max-w-[80%] h-1/2 rounded-lg"
              alt="preview"
            />
            <button className="border-2 border-[#6200B3] w-[80%] mt-2 cursor-pointer text-[#6200B3] p-1 px-4 rounded-md ">
            Download
          </button>

          </div>

          
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setPreviewImage(null)}>close</button>
          </form>
          
          
        </dialog>
      )}
      {groupMessages?.map((message, index) => {
        const isMine = message.user_id === authUser.user_id;
        const isImage = message.file_type?.startsWith("image/");

        return (
          <div
            key={`${message.user_id}-${message.created_at}-${index}`}
            className={`chat mt-2 ${isMine ? "chat-end" : "chat-start"}`}
          >
            

            <div>
              
              <div className='flex flex-row gap-3 '>
              {!isMine? <img src={message.user?.profile} className='w-9 h-9 chat-footer rounded-full object-cover' /> : null}
                <div
                  className={`chat-bubble rounded-xl ${isMine
                    ? "bg-[#6200B3] text-white shadow-2xl"
                    : "bg-white text-[#6200B3] shadow-4xl"
                    }`}
                >

                  {/* Image Message */}
                  {message.file_url && isImage && (
                    
                    <button
                      onClick={() => setPreviewImage(message.file_url)}
                      className="focus:outline-none"
                    >
                      <div className='flex flex-row justify-between gap-4'>
                        <p className={`opacity-50 text-xs ${isMine? `text-[#ffffff] ` : `text-[#3e3e3e] `}`}>{message.user.name}</p>
                        <time className={`text-[#3e3e3e] opacity-50 text-xs chat-footer  justify-end ${isMine? `text-[#ffffff] ` : `text-[#3e3e3e] `} `}>
                          {formatMessageTime(message.created_at)}
                        </time>
                      </div>
                      <img
                        src={message.file_url}
                        className="w-32 h-32 object-cover rounded-lg mb-2 cursor-pointer"
                        alt="chat-img"
                      />
                    </button>
                  )}

                  {/* File Message */}
                  
                  {message.file_url && !isImage && message.file_type && (
                    
                    <div className="flex flex-col gap-2">
                      <div className='flex flex-row justify-between gap-4'>
                        <p className={`opacity-50 text-xs ${isMine? `text-[#ffffff] ` : `text-[#3e3e3e] `}`}>{message.user.name}</p>
                        <time className={`text-[#3e3e3e] opacity-50 text-xs chat-footer  justify-end ${isMine? `text-[#ffffff] ` : `text-[#3e3e3e] `} `}>
                          {formatMessageTime(message.created_at)}
                        </time>
                      </div>

                      <div className="flex items-center gap-3">
                        {getFileIcon(message.file_type)}

                        <span className="truncate max-w-[200px] text-sm">
                          {truncateFileName(getFileNameFromUrl(message.file_url))}
                          
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const url = message.file_url;
                          const fileName = decodeURIComponent(
                            new URL(url).pathname.split("/").pop()
                          );

                          const link = document.createElement("a");
                          link.href = url;
                          link.download = fileName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="cursor-pointer border rounded-lg py-1 text-sm hover:bg-black/10"
                      >
                        Download
                      </button>
                    </div>
                  )}

                  {/* Text Message */}
                  {message.message_text && (
                    <div>
                      <div className='flex flex-row justify-between gap-4'>
                        <p className={`opacity-50 text-xs ${isMine? `text-[#ffffff] ` : `text-[#3e3e3e] `}`}>{message.user.name}</p>
                        <time className={`text-[#3e3e3e] opacity-50 text-xs chat-footer  justify-end ${isMine? `text-[#ffffff] ` : `text-[#3e3e3e] `} `}>
                          {formatMessageTime(message.created_at)}
                        </time>
                      </div>
                      <p className="mt-1">{message.message_text}</p>

                    </div>

                  )}

                </div>
                {isMine? <img src={message.user?.profile} className='w-9 h-9 chat-footer rounded-full object-cover' /> : null}

              </div>

             
            </div>

          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  )
}

export default GroupArea