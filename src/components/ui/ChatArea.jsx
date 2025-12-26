import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";
import {
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  File,
  X,
  Forward,
  Ellipsis,
  EllipsisVertical
} from "lucide-react";



// 1. Add this small component ABOVE your ChatArea component
const AudioMessage = ({ url, isMine }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const audioRef = useRef(null);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    setDuration(formatTime(audioRef.current.duration));
  };

  return (
    <div className="audio-bubble flex flex-col gap-1">
      <div className="flex items-center gap-3 w-full">
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        <button className="play-btn flex items-center justify-center" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={`flex justify-between text-[10px] px-1 ${isMine ? "text-white/80" : "text-[#6200B3]/80"}`}>
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
};



const ChatArea = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    isTyping,
    isSelecting,
    setIsSelecting
  } = useChatStore();

  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);


  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [checkedMessageIds, setCheckedMessageIds] = useState([]);
  const handleCheckboxChange = (id) => {
    setCheckedMessageIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // Remove if already there
        : [...prev, id]                      // Add if not there
    );
  };

  // Fetch messages
  useEffect(() => {
    if (!selectedUser || !authUser) return;

    getMessages({
      sender_id: authUser.user_id,
      receiver_id: selectedUser.user_id,
    });

    subscribeToMessages();
    subscribeToTyping();

    return () => {
      unsubscribeToMessages();
      unsubscribeFromTyping();
    };
  }, [selectedUser?.user_id]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex mt-30 text-black items-center justify-center">
        <span className="loading text-black loading-spinner loading-lg"></span>
      </div>
    );
  }

  const truncateFileName = (name, maxChars = 25) => {
    if (!name) return "";
    return name.length <= maxChars ? name : name.slice(0, maxChars) + "...";
  };

  // File icon resolver
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



  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 inter-large newbg ">

      {previewImage && (
        <dialog open className="modal ">
          <div className="modal-box flex flex-col items-center sm:w-1/2 w-full bg-white">
            <div className="flex  justify-end w-full mb-3">

              <button onClick={() => setPreviewImage(null)} >
                <X size={20} className=" cursor-pointer text-black" />
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

      {messages?.map((message, index) => {
        const isMine = message.user_id === authUser.user_id;
        const isImage = message.file_type?.startsWith("image/");
        const isAudio = message.file_type?.startsWith("audio/");
        const messageKey = message.id || `${message.created_at}-${index}`;

        return (
          <div
            key={messageKey}
            onMouseEnter={() => setHoveredMessageId(messageKey)}
            onMouseLeave={() => setHoveredMessageId(null)}
            className={`chat ${isMine ? "chat-end" : "chat-start"} `}
          >
            <div className="chat-header text-black flex items-center mb-1 gap-2">
              <time className="text-xs opacity-50 mt-2 mb-1">
                {formatMessageTime(message.created_at)}
              </time>
              {hoveredMessageId === messageKey && (
                <div className={`dropdown ${isMine ? 'dropdown-end' : 'dropdown-start'}`}>
                  <div role="button" tabIndex={0} className="hover:bg-[#d7d7d7] rounded-full p-1 cursor-pointer">
                    <EllipsisVertical className="text-[#424242]" size={13} />
                  </div>
                  <ul tabIndex={0} className="text-xs border border-[#d6beeb] p-1 dropdown-content menu bg-white rounded-box z-[20] w-40 shadow-sm">
                    <li>
                      <a className="text-[#6200B3] flex items-center active:!bg-[#6200B3] active:!text-white focus:bg-[#6200B3] focus:text-white">
                        <button onClick={()=>{setIsSelecting(true)}} className="flex items-center gap-3 cursor-pointer"><Forward size={15} />
                        Forward</button>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {isSelecting === true && (
              <div className="flex items-center z-10 border-2 rounded-1 border-[#9d53da] rounded-full">
              <input
                type="checkbox"
                id={`check-${messageKey}`}
                className="checkbox checkbox-xs m-1 
               border-[#6200B3] 
               checked:bg-[#6200B3] 
               checked:border-[#6200B3] 
               [--chkbg:#6200B3] [--chkfg:white] 
               cursor-pointer bg-white"
                checked={checkedMessageIds.includes(message.id)}
                onChange={() => handleCheckboxChange(message.id)}
              />
            </div>)}

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


              {/* Audio Message */}

              {message.file_url && isAudio && (
                <AudioMessage url={message.file_url} isMine={isMine} />
              )}

              {message.file_url && !isImage && !isAudio && message.file_type && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {getFileIcon(message.file_type)}

                    <span className="truncate max-w-[200px] text-sm">
                      {truncateFileName(
                        decodeURIComponent(
                          new URL(message.file_url).pathname.split("/").pop()
                        )
                      )}
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
          </div>
        );
      })}

      {isTyping && (
        <div className="text-sm mb-3 text-gray-800 italic ml-2">
          typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div >
  );
};

export default ChatArea;
