import React, { useRef, useState, useMemo } from 'react';
import toast from "react-hot-toast";
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Image,
  Send,
  Paperclip,
  X,
  FileText,
  FileIcon,
  FileTerminal,
  FileVideo,
  Mic,
  Square
} from 'lucide-react';

const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('audio/')) return Mic;
  if (mimeType.startsWith('text/') || mimeType.endsWith('/pdf')) return FileText;
  if (mimeType.endsWith('/msword') || mimeType.endsWith('/vnd.openxmlformats-officedocument.wordprocessingml.document')) return FileText;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.endsWith('/zip') || mimeType.endsWith('/rar')) return FileTerminal;
  return FileIcon;
};

const MessageInput = () => {
  const [text, setText] = useState("");
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  //  AUDIO RECORDING
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  //  RECORDING TIMER
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef(null);

  const { authUser } = useAuthStore();
  const { sendMessage, selectedUser, emitTyping, emitStopTyping } = useChatStore();

  const previewDetails = useMemo(() => {
    if (!attachmentFile) return null;
    const Icon = getFileIcon(attachmentFile.type);
    return {
      Icon,
      name: attachmentFile.name,
      mimeType: attachmentFile.type,
    };
  }, [attachmentFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setAttachmentFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachmentPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(file.name);
    }
  };

  const removeAttachment = () => {
    setAttachmentPreview(null);
    setAttachmentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    emitTyping();

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping();
    }, 1000);
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File(
          [audioBlob],
          `voice-${Date.now()}.webm`,
          { type: "audio/webm" }
        );

        setAttachmentFile(audioFile);
        setAttachmentPreview("Voice message");

        // 🛑 stop mic access
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !attachmentFile) return;

    setSendingMessage(true);

    const messageData = {
      sender_id: authUser.user_id,
      receiver_id: selectedUser.user_id,
      message_text: text.trim(),
      file: attachmentFile || null,
      fileName: attachmentFile?.name || null,
      fileType: attachmentFile?.type || null,
    };

    await sendMessage(messageData);

    setText("");
    removeAttachment();
    setSendingMessage(false);
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

      {/* ATTACHMENT PREVIEW */}
      {attachmentFile && previewDetails && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative p-2 rounded-lg border border-gray-300 flex items-center bg-white">

            {attachmentFile.type.startsWith("audio/") ? (
              <audio controls className="w-100" src={URL.createObjectURL(attachmentFile)} />
            ) : previewDetails.mimeType.startsWith('image/') && attachmentPreview ? (
              <img
                src={attachmentPreview}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <previewDetails.Icon className="w-8 h-8 text-[#998eff]" />
            )}

            <span className="ml-3 text-sm text-black max-w-xs truncate">
              {previewDetails.name}
            </span>

            <button
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">

          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="
              w-full input input-bordered rounded-xl border-2
              bg-white text-black border-gray-300
              outline-none focus:ring-0
              inter-large text-sm
              focus:border-[#998eff]
            "
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="btn btn-circle rounded-xl shadow-none bg-white border-2 border-gray-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="text-[#555555]" />
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
          disabled={!text.trim() && !attachmentFile}
          className="btn btn-circle rounded-xl shadow-none bg-white border-2 border-gray-300"
        >
          {sendingMessage
            ? <span className="loading loading-spinner loading-xs text-[#6200B3]"></span>
            : <Send className="text-[#555555]" />
          }
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
