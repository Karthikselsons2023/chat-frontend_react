import React, { useEffect, useRef, useState, useMemo } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";
import {
  FileText, FileImage, FileArchive, FileSpreadsheet, File,
  X, Forward, Trash2, EllipsisVertical, Download, Search, Check, Play, Pause
} from "lucide-react";

// ─── Audio Message Component ──────────────────────────────────────────────────
const AudioMessage = ({ url, isMine }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const audioRef = useRef(null);

  const fmt = (t) => isNaN(t) ? "0:00" : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  return (
    <div className={`flex flex-col gap-2 min-w-[200px] p-2 rounded-xl ${isMine ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex items-center gap-3 w-full">
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={() => {
            const c = audioRef.current.currentTime, d = audioRef.current.duration;
            setProgress((c / d) * 100);
            setCurrentTime(fmt(c));
          }}
          onLoadedMetadata={() => setDuration(fmt(audioRef.current.duration))}
          onEnded={() => setIsPlaying(false)}
        />
        <button
          className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-colors ${isMine ? 'bg-white text-[#6200B3]' : 'bg-[#6200B3] text-white'}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="h-1.5 bg-black/10 flex-1 rounded-full overflow-hidden cursor-pointer relative">
          <div className={`absolute top-0 left-0 h-full transition-all ${isMine ? 'bg-white' : 'bg-[#6200B3]'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex justify-between text-[10px] px-1 font-medium opacity-80">
        <span>{currentTime}</span><span>{duration}</span>
      </div>
    </div>
  );
};

// ─── Image Preview Modal ──────────────────────────────────────────────────────
const ImagePreviewModal = ({ images, startIndex, onClose, onDownload }) => {
  const [cur, setCur] = useState(startIndex);
  const prev = () => setCur(i => (i - 1 + images.length) % images.length);
  const next = () => setCur(i => (i + 1) % images.length);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button className="absolute right-4 top-4 p-2 bg-gray-100/80 backdrop-blur-md rounded-full hover:bg-gray-200 z-10 transition-colors" onClick={onClose}>
          <X size={20} className="text-gray-700" />
        </button>
        {images.length > 1 && (
          <div className="absolute left-4 top-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full z-10">
            {cur + 1} / {images.length}
          </div>
        )}
        <div className="flex flex-col items-center pt-2">
          <div className="relative w-full flex justify-center items-center min-h-[40vh] max-h-[65vh] bg-gray-50 rounded-2xl overflow-hidden">
            <img src={images[cur]} className="max-h-[65vh] object-contain"
              onError={e => { e.target.src = "https://placehold.co/400x400?text=Not+Found"; }} />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              <button onClick={prev} className="px-5 py-2.5 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">← Prev</button>
              <button onClick={next} className="px-5 py-2.5 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">Next →</button>
            </div>
          )}
          <button onClick={() => onDownload(images[cur], `image-${cur + 1}.jpg`)}
            className="mt-4 flex items-center gap-2 bg-[#6200B3] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#520099] transition-colors shadow-lg shadow-purple-200">
            <Download size={16} /> Download Image
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Forward Modal ────────────────────────────────────────────────────────────
const ForwardModal = ({ users, onClose, onForward }) => {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(null);

  const validUsers = Array.isArray(users) ? users : [];

  const filtered = validUsers.filter(u => {
    const userName = u?.name || u?.userName || "Unknown";
    return userName.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <span className="font-bold text-gray-900">Forward to…</span>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"><X size={18} className="text-gray-500" /></button>
        </div>
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search people…"
              className="bg-transparent text-sm outline-none flex-1 text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="overflow-y-auto max-h-64 py-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Search size={24} className="mb-2 opacity-50" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            filtered.map((u) => {
              const userId = u?.user_id || u?.id;
              const userName = u?.name || u?.userName || "Unknown User";
              const userProfile = u?.profile || u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6200B3&color=fff`;
              if (!userId) return null;
              const isActive = picked?.user_id === userId;
              return (
                <button
                  key={userId}
                  onClick={() => setPicked({ user_id: userId, name: userName, profile: userProfile })}
                  className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left ${isActive ? "bg-purple-50/50" : ""}`}
                >
                  <img src={userProfile} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt={userName} />
                  <span className={`text-sm font-medium ${isActive ? "text-[#6200B3]" : "text-gray-800"}`}>{userName}</span>
                  {isActive && <Check size={18} className="text-[#6200B3] ml-auto" />}
                </button>
              );
            })
          )}
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            disabled={!picked}
            onClick={() => onForward(picked)}
            className="w-full py-3 rounded-xl bg-[#6200B3] hover:bg-[#520099] text-white text-sm font-semibold disabled:opacity-40 disabled:hover:bg-[#6200B3] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Forward size={16} /> {picked ? `Send to ${picked.name}` : "Select someone"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirm = ({ count, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
    <div className="bg-white rounded-3xl w-full max-w-xs shadow-2xl p-6 text-center border border-gray-100" onClick={e => e.stopPropagation()}>
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Delete message{count !== 1 ? "s" : ""}?</h3>
      <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete {count} selected message{count !== 1 ? "s" : ""}? This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-red-200">Delete</button>
      </div>
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getFileIconElement = (type = "") => {
  if (type.includes("pdf")) return <FileText className="text-red-500" size={28} />;
  if (type.includes("image")) return <FileImage className="text-blue-500" size={28} />;
  if (type.includes("zip") || type.includes("rar")) return <FileArchive className="text-yellow-500" size={28} />;
  if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="text-green-500" size={28} />;
  return <File className="text-gray-500" size={28} />;
};

const getFilename = (url, fileType = "") => {
  try {
    const parts = new URL(url).pathname.split("/");
    return decodeURIComponent(parts.pop() || "file");
  } catch {
    return `download.${fileType.split("/")[1] || "file"}`;
  }
};

const msgKey = (msg, index) => (msg.id != null ? `id-${msg.id}` : `idx-${index}`);

// ─── Main ChatArea Component ──────────────────────────────────────────────────
const ChatArea = () => {
  const {
    messages, getMessages, isMessagesLoading, selectedUser,
    subscribeToMessages, unsubscribeToMessages,
    subscribeToTyping, unsubscribeFromTyping, isTyping,
    isSelecting, setIsSelecting, selectedChatIds, setSelectedChatIds,
    handleForwardMessages, deleteMessages,
    users, getUsers,
  } = useChatStore();

  // ✅ FIX 3: fetchAllUsers destructured so we can call it when ForwardModal opens
  const { authUser, allUsers, fetchAllUsers } = useAuthStore();
  const bottomRef = useRef(null);
  const selectionHeaderRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const forwardableUsers = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    return allUsers
      .filter(u => u.user_id !== authUser?.user_id)
      .map(u => ({
        user_id: u.user_id,
        name: u.name,
        profile: u.profile,
      }));
  }, [allUsers, authUser?.user_id]);

  const downloadFile = async (url, fileName) => {
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = fileName;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch { window.open(url, "_blank"); }
  };

  const toggleSelect = (id) => {
    if (!id) return;
    setSelectedChatIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleOptionClick = (e, msg) => {
    e.stopPropagation();
    setIsSelecting(true);
    if (msg.id) setSelectedChatIds([msg.id]);
  };

  const handleGroupOptionClick = (e, msgs) => {
    e.stopPropagation();
    setIsSelecting(true);
    const ids = msgs.map(m => m.id).filter(Boolean);
    setSelectedChatIds(ids);
  };

  useEffect(() => {
    if (!selectedUser || !authUser) return;
    getMessages({ sender_id: authUser.user_id, receiver_id: selectedUser.user_id });
    subscribeToMessages();
    subscribeToTyping();
    return () => { unsubscribeToMessages(); unsubscribeFromTyping(); };
  }, [selectedUser?.user_id]);

  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) getUsers?.();
  }, []);

  // ✅ FIX 3: Fetch all users when forward modal opens (if not already loaded)
  useEffect(() => {
    if (showForwardModal && (!allUsers || allUsers.length === 0)) {
      fetchAllUsers();
    }
  }, [showForwardModal]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  if (isMessagesLoading) {
    return <div className="flex-1 flex items-center justify-center bg-gray-50/50"><span className="loading loading-spinner text-[#6200B3] loading-lg"></span></div>;
  }

  // --- IMAGE GROUPING ---
  const grouped = [];
  let i = 0;
  while (i < messages.length) {
    const msg = messages[i];
    const mine = msg.user_id === authUser.user_id;
    if (msg.file_type?.startsWith("image/") && msg.file_url) {
      const group = [msg];
      let j = i + 1;
      while (j < messages.length && messages[j].file_type?.startsWith("image/") && (messages[j].user_id === authUser.user_id) === mine) {
        group.push(messages[j]); j++;
      }
      grouped.push({ type: "images", msgs: group, mine });
      i = j;
    } else {
      grouped.push({ type: "single", msg, mine });
      i++;
    }
  }

  return (
    <div className={`flex-1 flex flex-col bg-[#f8f9fa] relative ${isSelecting ? "pt-[88px]" : ""}`}>
      {/* Selection header */}
      {isSelecting && (
        <div ref={selectionHeaderRef} className="sticky top-0 left-0 right-0 z-[60] flex items-center justify-between bg-white px-6 h-[72px] border-b border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setIsSelecting(false); setSelectedChatIds([]); }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all"
            >
              <X size={22} />
            </button>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#6200B3]">
                {selectedChatIds.length} Selected
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Choose messages to forward or delete
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={selectedChatIds.length === 0}
              onClick={() => setShowForwardModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6200B3] text-white text-sm font-bold disabled:opacity-30 hover:bg-[#520099] transition-all"
            >
              <Forward size={16} /> Forward
            </button>
            <button
              disabled={selectedChatIds.length === 0}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold disabled:opacity-30 hover:bg-red-100 transition-all"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Message container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {imagePreview && <ImagePreviewModal images={imagePreview.images} startIndex={imagePreview.startIndex} onClose={() => setImagePreview(null)} onDownload={downloadFile} />}
        {showForwardModal && <ForwardModal users={forwardableUsers} onClose={() => setShowForwardModal(false)} onForward={async (u) => { setShowForwardModal(false); await handleForwardMessages(u); }} />}
        {showDeleteConfirm && <DeleteConfirm count={selectedChatIds.length} onConfirm={async () => { await deleteMessages(selectedChatIds); setShowDeleteConfirm(false); }} onCancel={() => setShowDeleteConfirm(false)} />}

        {grouped.map((group, gIdx) => {
          // --- GROUPED IMAGES ---
          if (group.type === "images") {
            const { msgs, mine } = group;
            const firstKey = msgKey(msgs[0], gIdx);
            const isSelected = msgs.some(m => selectedChatIds.includes(m.id));
            return (
              <div key={firstKey} className={`flex w-full ${mine ? "justify-end" : "justify-start"} group/msg`} onMouseEnter={() => setHoveredKey(firstKey)} onMouseLeave={() => setHoveredKey(null)}>
                <div className={`flex items-end gap-2 max-w-[85%] ${mine ? "flex-row-reverse" : "flex-row"}`}>
                  {isSelecting && (
                    <div className="flex-shrink-0 mb-2">
                      <input type="checkbox" checked={isSelected} className="checkbox checkbox-sm border-gray-300 checked:border-[#6200B3] checked:bg-[#6200B3]" onChange={() => msgs.forEach(m => toggleSelect(m.id))} />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <div className={`grid gap-1.5 ${msgs.length === 1 ? "grid-cols-1" : "grid-cols-2"} ${isSelected ? "ring-2 ring-purple-400 rounded-2xl p-1 bg-purple-50" : ""}`}>
                      {msgs.map((img, idx) => (
                        <div key={img.id || idx} className="relative group/img overflow-hidden rounded-xl border border-gray-100/50 shadow-sm">
                          <img
                            src={img.file_url}
                            className="w-40 h-40 md:w-48 md:h-48 object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
                            onClick={() => !isSelecting && setImagePreview({ images: msgs.map(m => m.file_url), startIndex: idx })}
                          />
                          <button
                            className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); downloadFile(img.file_url, getFilename(img.file_url, img.file_type)); }}
                          >
                            <Download size={14} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <span className={`text-[11px] text-gray-400 font-medium px-1 mt-0.5 ${mine ? "text-right" : "text-left"}`}>
                      {formatMessageTime(msgs[0].created_at)}
                    </span>
                  </div>
                  <button onClick={(e) => handleGroupOptionClick(e, msgs)} className={`p-1.5 hover:bg-gray-200 rounded-full mb-5 transition-all text-gray-400 hover:text-gray-600 ${hoveredKey === firstKey && !isSelecting ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <EllipsisVertical size={18} />
                  </button>
                </div>
              </div>
            );
          }

          // --- SINGLE MESSAGES ---
          const { msg, mine } = group;
          const key = msgKey(msg, gIdx);
          const isSelected = selectedChatIds.includes(msg.id);
          return (
            <div key={key} className={`flex w-full ${mine ? "justify-end" : "justify-start"} group/msg`} onMouseEnter={() => setHoveredKey(key)} onMouseLeave={() => setHoveredKey(null)}>
              <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[75%] ${mine ? "flex-row-reverse" : "flex-row"}`}>
                {isSelecting && (
                  <div className="flex-shrink-0 mb-2">
                    <input type="checkbox" checked={isSelected} className="checkbox checkbox-sm border-gray-300 checked:border-[#6200B3] checked:bg-[#6200B3]" onChange={() => toggleSelect(msg.id)} />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    onClick={() => isSelecting && toggleSelect(msg.id)}
                    className={`
                      relative px-4 py-2.5 shadow-sm transition-all cursor-default
                      ${mine
                        ? "bg-[#6200B3] text-white rounded-2xl rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-100/80 rounded-2xl rounded-bl-sm"
                      }
                      ${isSelected ? "ring-2 ring-purple-400 ring-offset-1" : ""}
                    `}
                  >
                    {msg.file_url && !msg.file_type?.startsWith("image/") && !msg.file_type?.startsWith("audio/") && (
                      <div className={`flex items-center gap-3 p-3 rounded-xl mb-1 min-w-[200px] ${mine ? 'bg-white/15' : 'bg-gray-50 border border-gray-100'}`}>
                        {getFileIconElement(msg.file_type)}
                        <div className="flex flex-col overflow-hidden flex-1">
                          <span className="text-sm font-semibold truncate">{getFilename(msg.file_url, msg.file_type)}</span>
                          <button onClick={(e) => { e.stopPropagation(); downloadFile(msg.file_url, getFilename(msg.file_url, msg.file_type)); }} className={`text-[11px] font-medium flex items-center gap-1 mt-1 opacity-80 hover:opacity-100 transition-opacity ${mine ? 'text-white' : 'text-[#6200B3]'}`}>
                            <Download size={12} /> Download file
                          </button>
                        </div>
                      </div>
                    )}
                    {msg.file_type?.startsWith("audio/") && <AudioMessage url={msg.file_url} isMine={mine} />}
                    {msg.message_text && <p className="text-[15px] leading-relaxed break-words">{msg.message_text}</p>}
                  </div>
                  <span className={`text-[11px] text-gray-400 font-medium px-1 ${mine ? "text-right" : "text-left"}`}>
                    {formatMessageTime(msg.created_at)}
                  </span>
                </div>
                <button onClick={(e) => handleOptionClick(e, msg)} className={`p-1.5 hover:bg-gray-200 rounded-full mb-5 transition-all text-gray-400 hover:text-gray-600 ${hoveredKey === key && !isSelecting ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <EllipsisVertical size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="bg-white border border-gray-100 px-4 py-3.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatArea;
