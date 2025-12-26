import React, { useRef, useState, useMemo } from 'react';
import toast from "react-hot-toast";
import { useAuthStore } from '../../../store/useAuthStore';
import { useChatStore } from '../../../store/useChatStore';
import { Image, Send, Paperclip, X,Mic,Square, FileText, File, FileIcon, FileType2, FileTerminal, FileVideo } from 'lucide-react';

const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
        return Image;
    }
    if (mimeType.startsWith('text/') || mimeType.endsWith('/pdf')) {
        return FileText;
    }
    if (mimeType.endsWith('/msword') || mimeType.endsWith('/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return FileText;
    }
    if (mimeType.startsWith('video/')) {
        return FileVideo;
    }
    if (mimeType.endsWith('/zip') || mimeType.endsWith('/rar')) {
        return FileTerminal;
    }
    // Default icon for any other file type
    return FileIcon;
};

const GroupMessageInput = () => {
    const [text, setText] = useState("");
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [attachmentFile, setAttachmentFile] = useState(null);
    const fileInputRef = useRef(null);
    const { authUser } = useAuthStore();
    const [fileName, setFileName] = useState();
    const [fileType, setFileType] = useState();
    const [sendingMessage, setSendingMessage] = useState(false);
    const { sendGroupMessage, selectedGroupId, upload } = useChatStore();
     //  AUDIO RECORDING
      const [isRecording, setIsRecording] = useState(false);
      const mediaRecorderRef = useRef(null);
      const audioChunksRef = useRef([]);
    
      //  RECORDING TIMER
      const [recordingTime, setRecordingTime] = useState(0);
      const recordingIntervalRef = useRef(null);
    

    const typingTimeoutRef = useRef(null);


    // Memoize the icon and name for easy access in the JSX
    const previewDetails = useMemo(() => {
        if (!attachmentFile) return null;
        const Icon = getFileIcon(attachmentFile.type);
        return {
            Icon,
            name: attachmentFile.name,
            mimeType: attachmentFile.type,
            size: attachmentFile.size,
        };
    }, [attachmentFile]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAttachmentFile(null);
        setAttachmentPreview(null);

        const MAX_SIZE = 2000 * 1024 * 1024; // approx. 2GB
        if (file.size > MAX_SIZE) {
            toast.error("File size must be less than 2GB");
            e.target.value = null; // Reset the input field
            return;
        }

        setAttachmentFile(file);


        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachmentPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {

            setAttachmentPreview(file.name);
        }
    };

    const removeAttachment = () => {
        setAttachmentPreview(null);
        setAttachmentFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // const handleTyping = (e) => {
    //     setText(e.target.value);

    //     emitTyping();

    //     if (typingTimeoutRef.current) {
    //         clearTimeout(typingTimeoutRef.current);
    //     }

    //     typingTimeoutRef.current = setTimeout(() => {
    //         emitStopTyping();
    //     }, 1000); // stops after 800ms of no typing
    // };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSendingMessage(true);
        const messageData = {
            user_id: authUser.user_id,
            chat_id : selectedGroupId,
            message_text: text.trim(),
            file: "",
            fileName: "",
            fileType: "",
            user : {
                profile : authUser.profile,
                name : authUser.name,
            }
        };

        if (attachmentFile) {
            messageData.file = attachmentFile;
            messageData.fileName = attachmentFile.name;
            messageData.fileType = attachmentFile.type;
        }

        await sendGroupMessage(messageData);

        removeAttachment();
        setSendingMessage(false);
        setText("");
        console.log("message send handler clicked")

    };


      // 🎙️ START RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
  // 1. Create the blob from chunks
  const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

  // 2. Instead of 'new File()', just manually attach the properties 
  // needed for your 'messageData' object later
  audioBlob.name = `voice-${Date.now()}.webm`;
  audioBlob.lastModifiedDate = new Date();

  // 3. Set the states
  setAttachmentFile(audioBlob); 
  setAttachmentPreview(URL.createObjectURL(audioBlob));

  // 4. Stop mic access
  stream.getTracks().forEach(t => t.stop());
};

      recorder.start();
      setIsRecording(true);

      // ⏱️ TIMER START
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

    } catch {
      toast.error("Microphone permission denied");
    }
  };

  // ⏹️ STOP RECORDING
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = null;
  };

    return (
        <div className="p-4 w-full nochatbg text-main border-t-1 border-gray-300">

            {/* 🔴 RECORDING INDICATOR */}
      {isRecording && (
        <div className="mb-2 flex items-center gap-2 text-sm text-red-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="font-medium">Recording…</span>
          <span className="opacity-70">
            {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
            {String(recordingTime % 60).padStart(2, "0")}
          </span>
        </div>
      )}

            {attachmentFile && previewDetails && (
    <div className="mb-3 flex items-center gap-2">
        <div className="relative p-2 rounded-lg border border-gray-300 flex items-center bg-white">
            
            {/* 1. Audio Preview: Show ONLY the player */}
            {previewDetails.mimeType.startsWith('audio/') ? (
                <div className="px-2 py-1">
                    <audio 
                        controls 
                        className="w-72 h-10" 
                        src={URL.createObjectURL(attachmentFile)} 
                    />
                </div>
            ) : (
                /* 2. Other Files: Show Icon and Name */
                <>
                    {previewDetails.mimeType.startsWith('image/') && attachmentPreview ? (
                        <img
                            src={attachmentPreview}
                            alt="Image Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                    ) : (
                        <previewDetails.Icon className='w-8 h-8 text-[#998eff]' />
                    )}

                    <span className="ml-3 text-sm text-black max-w-xs truncate" title={previewDetails.name}>
                        {previewDetails.name}
                    </span>
                </>
            )}

            {/* Close Button - remains for all types */}
            <button
                onClick={removeAttachment}
                className="p-1 cursor-pointer absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                type="button"
            >
                <X className='w-4 h-4' />
            </button>
        </div>
    </div>
)}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        onChange={(e) => setText(e.target.value)}
                        className="
        w-full input input-bordered rounded-xl border-2
        bg-white text-black border-gray-300
        outline-none
        focus:outline-none
        focus:ring-0
        focus:shadow-none inter-large text-sm
        focus:border-[#998eff]
      "
                        value={text}
                        placeholder="Type a message..."

                    />

                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <button
                        type="button"
                        className={`sm:flex hover:border-[#b6b5ff] btn btn-circle rounded-xl shadow-none bg-white border-2 border-gray-300 ${attachmentFile ? "text-success border-[#998eff]" : "text-muted"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className='text-[#555555]' />
                    </button>
                    <button
            type="button"
            className="btn btn-circle rounded-xl shadow-none bg-white border-2 border-gray-300"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording
              ? <Square className="text-red-500" />
              : <Mic className="text-[#555555]" />
            }
          </button>
                </div>

                <button
                    type="submit"
                    className="btn hover:border-[#b6b5ff] btn-circle rounded-xl shadow-none bg-white border-2 border-gray-300"
                    disabled={!text.trim() && !attachmentFile}
                >
                    {sendingMessage
                        ? <span className="loading loading-spinner loading-xs text-[#6200B3]"></span>
                        : <Send className="text-[#555555]" />
                    }
                </button>
            </form>
        </div>
    )
}

export default GroupMessageInput