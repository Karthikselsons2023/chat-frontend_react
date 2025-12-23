import React, { useEffect,useRef,useState  } from 'react'
import { useChatStore } from '../../../store/useChatStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { formatMessageTime } from '../../../lib/utils';


const GroupArea = () => {

  const { authUser } = useAuthStore();
  const { selectedGroupId, getGroupMessages,groupMessages,fetchingGroupMessages } = useChatStore();

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
    <div className='p-5'>
      {groupMessages?.map((message, index) => {
        const isMine = message.user_id === authUser.user_id;
        const isImage = message.file_type?.startsWith("image/");

        return (
          <div
            key={`${message.user_id}-${message.created_at}-${index}`}
            className={`chat mt-2 ${isMine ? "chat-end" : "chat-start"}`}
          >
            

            <div>
              <p className='text-[#3e3e3e] text-xs mb-2'>{message.user.name}</p>
              <div className='flex flex-row gap-3 '>

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
                    <p className="mt-1">{message.message_text}</p>
                  )}

                </div>
                <img src={message.user?.profile} className='w-9 h-9 chat-footer rounded-full object-cover' />

              </div>

              <div className=" mb-1 text-black">
                <time className="text-xs chat-footer opacity-50 justify-end">
                  {formatMessageTime(message.created_at)}
                </time>
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